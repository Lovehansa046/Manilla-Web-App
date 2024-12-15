const {getConnection, connectionConfig} = require('./dbConnection');

const tables = [
    {
        name: 'Product_type',
        query: `CREATE TABLE Product_type
                (
                    id          INT PRIMARY KEY AUTO_INCREMENT,
                    name        VARCHAR(100) NOT NULL,
                    description TEXT
                )`,
    },
    {
        name: 'Product',
        query: `CREATE TABLE Product
                (
                    id                 INT PRIMARY KEY AUTO_INCREMENT,
                    name               VARCHAR(100)   NOT NULL,
                    description        TEXT,
                    price              DECIMAL(10, 2) NOT NULL,
                    image              VARCHAR(255), -- Путь к изображению продукта
                    product_type_id    INT            NOT NULL,
                    is_alcoholic       BOOLEAN DEFAULT FALSE,
                    quantity_available INT,
                    FOREIGN KEY (product_type_id) REFERENCES Product_type (id)
                )`,
    },
    {
        name: 'Product_quantity',
        query: `CREATE TABLE Product_quantity
                (
                    id         INT PRIMARY KEY AUTO_INCREMENT,
                    product_id INT NOT NULL,
                    quantity   INT NOT NULL,
                    FOREIGN KEY (product_id) REFERENCES Product (id)
                )`,
    },
    {
        name: 'Role',
        query: `CREATE TABLE Role
                (
                    id          INT PRIMARY KEY AUTO_INCREMENT,
                    name        VARCHAR(100) NOT NULL,
                    description TEXT
                )`,
    },
    {
        name: 'User',
        query: `CREATE TABLE User
                (
                    id        INT PRIMARY KEY AUTO_INCREMENT,
                    FirstName VARCHAR(100) NOT NULL,
                    LastName  VARCHAR(100) NOT NULL,
                    Email     VARCHAR(255) NOT NULL UNIQUE,
                    Password  VARCHAR(255) NOT NULL,
                    image     VARCHAR(255), -- Путь к изображению аватара пользователя
                    role_id   INT          NOT NULL,
                    FOREIGN KEY (role_id) REFERENCES Role (id)
                )`,
    },
    {
        name: 'Transactions',
        query: `CREATE TABLE Transactions
                (
                    id           INT PRIMARY KEY AUTO_INCREMENT,
                    sku          VARCHAR(50)    NOT NULL,
                    user_id      INT            NOT NULL,
                    price_bucket DECIMAL(10, 2) NOT NULL,
                    date_buy     DATETIME       NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES User (id)
                )`,
    },
    {
        name: 'Transactions_bucket',
        query: `CREATE TABLE Transactions_bucket
                (
                    id             INT PRIMARY KEY AUTO_INCREMENT,
                    transaction_id INT NOT NULL,
                    product_id     INT NOT NULL,
                    quantity       INT NOT NULL DEFAULT 1,
                    FOREIGN KEY (transaction_id) REFERENCES Transactions (id),
                    FOREIGN KEY (product_id) REFERENCES Product (id)
                )`,
    },
    {
        name: 'Predicted_Orders',
        query: `CREATE TABLE Predicted_Orders
                (
                    id             INT PRIMARY KEY AUTO_INCREMENT,
                    user_id        INT  NOT NULL,
                    predicted_date DATE NOT NULL,
                    predicted_time TIME NOT NULL,
                    products       JSON NOT NULL,
                    status         VARCHAR(50) DEFAULT 'pending',
                    created_at     DATETIME    DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES User (id)
                )`,
    },
];


async function checkAndCreateTables() {
    try {
        const connection = await getConnection();

        for (const table of tables) {
            const [rows] = await connection.query(
                `SELECT COUNT(*) AS count
                 FROM information_schema.tables
                 WHERE table_schema = ? AND table_name = ?`,
                [connectionConfig.database, table.name] // Используем connectionConfig.database напрямую
            );

            if (rows[0].count === 0) {
                console.log(`Создаю таблицу: ${table.name}`);
                await connection.query(table.query);
            } else {
                console.log(`Таблица ${table.name} уже существует`);
            }
        }

        await connection.end();
        console.log('Проверка таблиц завершена.');
    } catch (error) {
        console.error('Ошибка при проверке или создании таблиц:', error);
    }
}

checkAndCreateTables();
