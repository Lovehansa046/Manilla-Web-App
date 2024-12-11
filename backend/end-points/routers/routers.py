from fastapi import APIRouter
from backend.end_points.routers.user_router import router as user_router
from backend.end_points.routers.product_router import router as product_router
from backend.end_points.routers.product_type_router import router as product_type_router
from backend.end_points.routers.transaction_router import router as transaction_router

api_router = APIRouter()

api_router.include_router(user_router, prefix="/users", tags=["Users"])
api_router.include_router(product_router, prefix="/products", tags=["Products"])
api_router.include_router(product_type_router, prefix="/product-types", tags=["Product Types"])
api_router.include_router(transaction_router, prefix="/transactions", tags=["Transactions"])
