from fastapi import HTTPException
from datetime import date
from typing import Optional
from sqlalchemy.exc import IntegrityError
from app.domains.finance.infrastructure.models import TransactionType
from app.domains.finance.infrastructure.repository_impl import (
    AccountRepositoryImpl,
    TransactionRepositoryImpl,
    CategoryRepositoryImpl,
)
from app.domains.finance.api.schemas import (
    AccountCreate,
    AccountUpdate,
    CategoryCreate,
    CategoryUpdate,
    TransactionCreate,
    TransactionUpdate,
)


class AccountService:
    def __init__(self, account_repo: AccountRepositoryImpl):
        self.account_repo = account_repo

    def create_account(self, user_id: int, data: AccountCreate):
        create_dict = data.model_dump()
        create_dict["user_id"] = user_id
        return self.account_repo.create(create_dict)

    def update_account(self, account_id: str, user_id: int, update_data: AccountUpdate):
        account = self.account_repo.get_by_id(account_id)
        if not account:
            raise HTTPException(status_code=404, detail="account not found")

        if account.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Unauthorized to modify this account"
            )

        update_dict = update_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(account, key, value)

        return self.account_repo.update(account)

    def delete_account(self, account_id: str, user_id: int):
        account = self.account_repo.get_by_id(account_id)
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        if account.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Unauthorized to delete this account"
            )

        try:
            self.account_repo.delete(account)
            return {"message": "Account successfully deleted"}
        except IntegrityError:
            self.account_repo.db.rollback()
            raise HTTPException(
                status_code=400,
                detail="Tidak bisa menghapus akun ini karena masih memiliki riwayat transaksi.",
            )

    def get_user_accounts(self, user_id: int):
        return self.account_repo.get_by_user_id(user_id)


class CategoryService:
    def __init__(self, category_repo: CategoryRepositoryImpl):
        self.category_repo = category_repo

    def create_category(self, user_id: int, data: CategoryCreate):
        create_dict = data.model_dump()
        create_dict["user_id"] = user_id
        return self.category_repo.create(create_dict)

    def update_category(
        self, category_id: str, user_id: int, update_data: CategoryUpdate
    ):
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise HTTPException(status_code=404, detail="category not found")

        if category.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Unauthorized to modify this category"
            )

        update_dict = update_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(category, key, value)

        return self.category_repo.update(category)

    def delete_category(self, category_id: str, user_id: int):
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        if category.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Unauthorized to delete this category"
            )

        try:
            self.category_repo.delete(category)
            return {"message": "Category successfully deleted"}
        except IntegrityError:
            self.category_repo.db.rollback()
            raise HTTPException(
                status_code=400,
                detail="Tidak bisa menghapus kategori ini karena sudah digunakan dalam transaksi.",
            )

    def get_user_category(self, user_id: int):
        return self.category_repo.get_by_user_id(user_id)


class TransactionService:
    def __init__(
        self, tx_repo: TransactionRepositoryImpl, acc_repo: AccountRepositoryImpl
    ):
        self.tx_repo = tx_repo
        self.acc_repo = acc_repo

    def get_transactions_all(
        self,
        user_id: int,
        start_date: date,
        end_date: date,
        category_id: Optional[str] = None,
        type: Optional[TransactionType] = None,
    ):
        return self.tx_repo.get_by_all(user_id, start_date, end_date, category_id, type)

    def create_transaction(self, user_id: int, tx_data: TransactionCreate):
        account = self.acc_repo.get_by_id(tx_data.account_id)
        if not account:
            raise HTTPException(status_code=404, detail="Source account not found")

        if tx_data.type == TransactionType.IN:
            account.balance += tx_data.amount

        elif tx_data.type == TransactionType.OUT:
            if account.balance < tx_data.amount:
                raise HTTPException(status_code=400, detail="Insufficient balance")
            account.balance -= tx_data.amount

        elif tx_data.type == TransactionType.TRANSFER:
            if not tx_data.to_account_id:
                raise HTTPException(
                    status_code=400, detail="TRANSFER type requires 'to_account_id'"
                )

            target_account = self.acc_repo.get_by_id(tx_data.to_account_id)
            if not target_account:
                raise HTTPException(status_code=404, detail="Target account not found")

            account.balance -= tx_data.amount
            target_account.balance += tx_data.amount

            self.acc_repo.update(target_account)

        self.acc_repo.update(account)

        create_dict = tx_data.model_dump()
        create_dict["user_id"] = user_id
        return self.tx_repo.create(create_dict)

    def update_transaction(
        self, tx_id: str, user_id: int, update_data: TransactionUpdate
    ):
        tx = self.tx_repo.get_by_id(tx_id)
        if not tx:
            raise HTTPException(status_code=404, detail="Transaction not found")

        if tx.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Unauthorized to modify this transaction"
            )

        old_acc = self.acc_repo.get_by_id(tx.account_id)
        if tx.type == TransactionType.IN:
            old_acc.balance -= tx.amount
        elif tx.type == TransactionType.OUT:
            old_acc.balance += tx.amount
        elif tx.type == TransactionType.TRANSFER:
            old_to_acc = self.acc_repo.get_by_id(tx.to_account_id)
            old_acc.balance += tx.amount
            if old_to_acc:
                old_to_acc.balance -= tx.amount
                self.acc_repo.update(old_to_acc)
        self.acc_repo.update(old_acc)

        update_dict = update_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(tx, key, value)

        new_acc = self.acc_repo.get_by_id(tx.account_id)
        if tx.type == TransactionType.IN:
            new_acc.balance += tx.amount
        elif tx.type == TransactionType.OUT:
            new_acc.balance -= tx.amount
        elif tx.type == TransactionType.TRANSFER:
            if not tx.to_account_id:
                raise HTTPException(
                    status_code=400, detail="TRANSFER requires to_account_id"
                )
            new_to_acc = self.acc_repo.get_by_id(tx.to_account_id)
            new_acc.balance -= tx.amount
            if new_to_acc:
                new_to_acc.balance += tx.amount
                self.acc_repo.update(new_to_acc)
        self.acc_repo.update(new_acc)

        return self.tx_repo.update(tx)

    def delete_transaction(self, tx_id: str, user_id: int):
        tx = self.tx_repo.get_by_id(tx_id)
        if not tx:
            raise HTTPException(status_code=404, detail="Transaction not found")

        if tx.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Unauthorized to delete this transaction"
            )

        account = self.acc_repo.get_by_id(tx.account_id)

        if tx.type == TransactionType.IN:
            account.balance -= tx.amount
        elif tx.type == TransactionType.OUT:
            account.balance += tx.amount
        elif tx.type == TransactionType.TRANSFER:
            account.balance += tx.amount
            if tx.to_account_id:
                to_account = self.acc_repo.get_by_id(tx.to_account_id)
                if to_account:
                    to_account.balance -= tx.amount
                    self.acc_repo.update(to_account)

        self.acc_repo.update(account)

        self.tx_repo.delete(tx)

        return {"message": "Transaction successfully deleted"}

    def get_transaction_summary(
        self,
        user_id: int,
        start_date: date,
        end_date: Optional[date] = None,
        category_id: Optional[str] = None,
    ):
        return self.tx_repo.get_summary_month_category(
            user_id, start_date, end_date, category_id
        )

    def get_transaction_summary_by_all_categories(
        self, user_id: int, start_date: date, end_date: Optional[date] = None
    ):
        return self.tx_repo.get_summary_by_all_categories(user_id, start_date, end_date)
    
    def get_transaction_summary_by_day(
        self, user_id: int, start_date: date, end_date: Optional[date] = None
    ):
        return self.tx_repo.get_transaction_summary_by_day(user_id, start_date, end_date)
