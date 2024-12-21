const {MongoClient} = require('mongodb');

// Конфигурация подключения
const connectionConfig = {
    uri: 'mongodb://localhost:27017/', // Локальная строка подключения
    dbName: 'Manilla', // Имя базы данных
};

async function getConnection() {
    let client;
    try {
        client = new MongoClient(connectionConfig.uri);
        await client.connect(); // Подключаемся к базе данных
        console.log('Успешное подключение к MongoDB через Node.js');
        const db = client.db(connectionConfig.dbName); // Получаем доступ к базе данных
        return {db, client}; // Возвращаем как db, так и client для возможного закрытия соединения
    } catch (error) {
        console.error("Ошибка при подключении к MongoDB:", error);
        throw new Error("Не удалось подключиться к базе данных");
    }
}

module.exports = {getConnection, connectionConfig};
