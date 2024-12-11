from pydantic import BaseModel

# Запрос на создание типа продукта
class ProductTypeCreate(BaseModel):
    name: str
    description: Optional[str]

# Ответ для типа продукта
class ProductTypeResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]

    class Config:
        orm_mode = True
