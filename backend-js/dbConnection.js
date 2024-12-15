const mysql = require('mysql2/promise'); // Используем promise-совместимую версию

// Конфигурация подключения
const connectionConfig = {
    host: 'localhost',       // Хост MySQL
    user: 'root',            // Имя пользователя MySQL
    password: '',            // Пароль пользователя (замените на свой)
    database: 'Manilla',     // Имя базы данных
};

// Создаем асинхронную функцию для подключения
async function getConnection() {
    const connection = await mysql.createConnection(connectionConfig); // Используем промис
    console.log('Успешное подключение к MySQL через Node.js');
    return connection;
}

module.exports = {getConnection, connectionConfig};
