from sqlalchemy import Column, Integer, String, Boolean, Text, DECIMAL, ForeignKey
from backend.database.database_connector import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(DECIMAL(10, 2), nullable=False)
    image = Column(String(255), nullable=True)
    product_type_id = Column(Integer, ForeignKey("product_type.id"), nullable=False)
    is_alcoholic = Column(Boolean, default=False)
    quantity_available = Column(Integer, nullable=True)
