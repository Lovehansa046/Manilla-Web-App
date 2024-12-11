from pydantic import BaseModel
from typing import Optional

# Запрос на создание продукта
class ProductCreate(BaseModel):
    name: str
    description: Optional[str]
    price: float
    image: Optional[str]
    product_type_id: int
    is_alcoholic: Optional[bool] = False
    quantity_available: Optional[int]

# Запрос на обновление продукта
class ProductUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    price: Optional[float]
    image: Optional[str]
    product_type_id: Optional[int]
    is_alcoholic: Optional[bool]
    quantity_available: Optional[int]

# Ответ продукта
class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    image: Optional[str]
    product_type_id: int
    is_alcoholic: bool
    quantity_available: Optional[int]

    class Config:
        orm_mode = True
