from sqlalchemy import Column, Integer, String
from database.database_connector import Base


class User(base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)  # НЕ ПАРОЛЬ, Хэш пароля
    image = Column(String(255), nullable=True)
