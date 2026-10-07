from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.domains.users.infrastructure import models as user_models
from app.domains.finance.infrastructure import models as finance_models
from app.domains.investment.infrastructure import models as investment_models
from app.domains.users.api.router import router as auth_router
from app.domains.finance.api.router import router as finance_router
# from app.domains.investment.api.router import router as investment_router
from app.domains.highlight.api.router import router as highlight_router

user_models.Base.metadata.create_all(bind=engine)
finance_models.Base.metadata.create_all(bind=engine)
investment_models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Thabig App API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(finance_router)
# app.include_router(investment_router)
app.include_router(highlight_router)


@app.get("/")
def read_root():
    return {"message": "Selamat datang di Backend Super App!"}
