from pydantic import BaseModel, EmailStr
from typing import Optional

# Запрос на создание пользователя
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str  # Пароль будет хешироваться до записи в базу

# Ответ для пользователя
class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    image: Optional[str]  # Аватар пользователя

    class Config:
        orm_mode = True
