#Базовая херабора
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
#
# DATABASE_URL = "mysql+pymysql://root@localhost/Manilla"
#
# # SQLAlchemy setup
# engine = create_engine(DATABASE_URL, echo=True)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()
#
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()



# #TODO
# # 1. сделай подключение к бд для MYSQL PHPmyADMIN.
# # 2. в MODELS сделай таблицы, чтобы можно было использовать данные из бд в коде
# # 3. Напиши для начало пару endpoints (создание user, product, type_product, transactions) во всех должны быть Create, Delete, Edit (Кроме transactions в нем должен быть только Create. Изменять и удалять его нельзя)
# # 4. Нужны к ним schemas так что можно будет видеть пользователю, а что можно будет видеть админу при изменение товара
# # DEADLINE 25.11.2024

# **Таблица Product**

# CREATE TABLE Product (
#     id INT PRIMARY KEY AUTO_INCREMENT,
#     name VARCHAR(100) NOT NULL,
#     description TEXT,
#     price DECIMAL(10, 2) NOT NULL,
#     image VARCHAR(255),
#     product_type_id INT NOT NULL,
#     is_alcoholic BOOLEAN DEFAULT FALSE,  -- Для напитков, чтобы отметить, алкогольный ли продукт
#     quantity_available INT,  -- Для напитков или товаров с определённым количеством
#     FOREIGN KEY (product_type_id) REFERENCES Product_type(id)
# );

# **Таблица Product_type**

# CREATE TABLE Product_type (
#     id INT PRIMARY KEY AUTO_INCREMENT,
#     name VARCHAR(100) NOT NULL,
#     description TEXT
# );


# **Таблица Product_quantity**

# CREATE TABLE Product_quantity (
#     id INT PRIMARY KEY AUTO_INCREMENT,
#     product_id INT NOT NULL,
#     quantity INT NOT NULL,
#     FOREIGN KEY (product_id) REFERENCES Product(id)
# );


# **Таблица User**

# {
#         id: '1',
#         FirstName: 'Капучино',
#         LastName:  'Капучино2'
#         Email: "example@example.com"
#         Password: "Example" (hash) (Varchar255)
#         image: 'https://via.placeholder.com/400'
#  },

# **Таблица Transactions**

# CREATE TABLE Transactions (
#     id INT PRIMARY KEY AUTO_INCREMENT,
#     sku VARCHAR(50) NOT NULL,
#     user_id INT NOT NULL,
#     price_bucket DECIMAL(10, 2) NOT NULL,
#     data_buy DATETIME NOT NULL,  -- Используем DATETIME
#     FOREIGN KEY (user_id) REFERENCES Users(user_id)
# );



# **Таблица Transactions_bucket**

# CREATE TABLE Transactions_bucket (
#     id INT PRIMARY KEY AUTO_INCREMENT,
#     transaction_id INT NOT NULL,    -- Ссылается на транзакцию
#     product_id INT NOT NULL,        -- Идентификатор продукта
#     quantity INT NOT NULL DEFAULT 1, -- Количество товара
#     FOREIGN KEY (transaction_id) REFERENCES Transactions(id),
#     FOREIGN KEY (product_id) REFERENCES Products(id)
# );

# вот тебе полноценное ТЗ
