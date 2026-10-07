import uuid
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session, joinedload, load_only
from sqlalchemy import func
from datetime import date
from app.domains.finance.infrastructure.models import (
    AccountModel,
    TransactionType,
    TransactionModel,
    CategoryModel,
)


class AccountRepositoryImpl:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, account_id: str) -> Optional[AccountModel]:
        return self.db.query(AccountModel).filter(AccountModel.id == account_id).first()

    def create(self, account_data: dict) -> AccountModel:
        db_account = AccountModel(id=str(uuid.uuid4()), **account_data)
        self.db.add(db_account)
        self.db.commit()
        self.db.refresh(db_account)
        return db_account

    def update(self, account: AccountModel) -> AccountModel:
        self.db.commit()
        self.db.refresh(account)
        return account

    def delete(self, account: AccountModel):
        self.db.delete(account)
        self.db.commit()
        return True

    def get_by_id(self, account_id: str) -> Optional[AccountModel]:
        return self.db.query(AccountModel).filter(AccountModel.id == account_id).first()

    def get_by_user_id(self, user_id: int) -> List[AccountModel]:
        return self.db.query(AccountModel).filter(AccountModel.user_id == user_id).all()

    def update(self, account: AccountModel) -> AccountModel:
        self.db.commit()
        self.db.refresh(account)
        return account


class CategoryRepositoryImpl:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, category_id: str) -> Optional[CategoryModel]:
        return (
            self.db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
        )

    def create(self, category_data: dict) -> CategoryModel:
        db_category = CategoryModel(id=str(uuid.uuid4()), **category_data)
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    def update(self, category: CategoryModel) -> CategoryModel:
        self.db.commit()
        self.db.refresh(category)
        return category

    def delete(self, category: CategoryModel):
        self.db.delete(category)
        self.db.commit()
        return True

    def get_by_user_id(self, user_id: int) -> List[CategoryModel]:
        return (
            self.db.query(CategoryModel).filter(CategoryModel.user_id == user_id).all()
        )


class TransactionRepositoryImpl:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, transaction_id: str) -> Optional[TransactionModel]:
        return (
            self.db.query(TransactionModel)
            .filter(TransactionModel.id == transaction_id)
            .first()
        )

    def create(self, tx_data: dict) -> TransactionModel:
        db_tx = TransactionModel(id=str(uuid.uuid4()), **tx_data)
        self.db.add(db_tx)
        self.db.commit()
        self.db.refresh(db_tx)
        return db_tx

    def update(self, transaction: TransactionModel) -> TransactionModel:
        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def delete(self, transaction: TransactionModel):
        self.db.delete(transaction)
        self.db.commit()
        return True

    def get_by_user_id(self, user_id: int) -> List[TransactionModel]:
        return (
            self.db.query(TransactionModel)
            .filter(TransactionModel.user_id == user_id)
            .all()
        )

    def get_by_all(
        self,
        user_id: int,
        start_date: date,
        end_date: date,
        category_id: Optional[str] = None,
        type: Optional[TransactionType] = None,
    ) -> List[TransactionModel]:

        query = (
            self.db.query(TransactionModel)
            .options(
                joinedload(TransactionModel.account).load_only(
                    AccountModel.name, AccountModel.id, AccountModel.type
                )
            )
            .filter(TransactionModel.user_id == user_id)
        )

        query = query.filter(TransactionModel.transaction_date >= start_date)
        query = query.filter(TransactionModel.transaction_date <= end_date)

        if category_id:
            query = query.filter(TransactionModel.category_id == category_id)

        if type:
            query = query.filter(TransactionModel.type == type)

        return query.order_by(TransactionModel.transaction_date.desc()).all()

    def get_summary_month_category(
        self,
        user_id: int,
        start_date: date,
        end_date: Optional[date] = None,
        category_id: Optional[str] = None,
    ) -> dict:
        query = self.db.query(
            func.count(TransactionModel.id).label("total_count"),
            func.sum(TransactionModel.amount).label("total_amount"),
        ).filter(TransactionModel.user_id == user_id)

        if end_date:
            query = query.filter(TransactionModel.transaction_date >= start_date)
            query = query.filter(TransactionModel.transaction_date <= end_date)
        else:
            query = query.filter(TransactionModel.transaction_date == start_date)

        if category_id:
            query = query.filter(TransactionModel.category_id == category_id)

        result = query.first()

        return {
            "total_count": result.total_count or 0,
            "total_amount": result.total_amount or 0.0,
        }

    def get_summary_by_all_categories(
        self, user_id: int, start_date: date, end_date: Optional[date] = None
    ) -> Dict[str, Any]:

        query = (
            self.db.query(
                CategoryModel.id.label("category_id"),
                CategoryModel.name.label("category_name"),
                CategoryModel.color.label("category_color"),
                func.count(TransactionModel.id).label("total_count"),
                func.sum(TransactionModel.amount).label("total_amount"),
            )
            .join(CategoryModel, TransactionModel.category_id == CategoryModel.id)
            .filter(TransactionModel.user_id == user_id)
        )

        if end_date:
            query = query.filter(TransactionModel.transaction_date >= start_date)
            query = query.filter(TransactionModel.transaction_date <= end_date)
        else:
            query = query.filter(TransactionModel.transaction_date == start_date)

        query = query.group_by(CategoryModel.id)

        results = query.all()

        categories_data = []
        grand_total_count = 0
        grand_total_amount = 0

        for r in results:
            amount = r.total_amount or 0
            count = r.total_count or 0

            categories_data.append(
                {
                    "category_id": r.category_id,
                    "category_name": r.category_name,
                    "category_color": r.category_color,
                    "total_count": count,
                    "total_amount": amount,
                }
            )

            grand_total_count += count
            grand_total_amount += amount

        return {
            "categories": categories_data,
            "grand_total_count": grand_total_count,
            "grand_total_amount": grand_total_amount,
        }

    def get_transaction_summary_by_day(
        self,
        user_id: int,
        start_date: date,
        end_date: date = None,
    ) -> List[Dict[str, Any]]:
        
        query = (
            self.db.query(
                func.date(TransactionModel.transaction_date).label("date"),
                func.sum(TransactionModel.amount).label("total_amount"),
                func.count(TransactionModel.id).label("total_transactions")
            )
            .filter(TransactionModel.user_id == user_id)
        )

        if end_date:
            query = query.filter(func.date(TransactionModel.transaction_date) >= start_date)
            query = query.filter(func.date(TransactionModel.transaction_date) <= end_date)
        else:
            query = query.filter(func.date(TransactionModel.transaction_date) == start_date)

        query = query.group_by("date").order_by("date")

        results = query.all()

        return [
            {
                "date": row.date,
                "total_amount": row.total_amount or 0,
                "total_transactions": row.total_transactions
            }
            for row in results
        ]
