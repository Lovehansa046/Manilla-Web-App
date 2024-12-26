import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

// Конфигурация подключения
const connectionConfig = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/', // Используем строку из переменной окружения
    dbName: process.env.MONGODB_DB_NAME || 'Manilla', // Имя базы данных из переменной окружения
};

// Функция для получения подключения к базе данных
export async function getConnection() {
    let client;
    try {
        client = new MongoClient(connectionConfig.uri);
        await client.connect(); // Подключаемся к базе данных
        console.log('Успешное подключение к MongoDB');
        const db = client.db(connectionConfig.dbName); // Получаем доступ к базе данных
        return {db, client}; // Возвращаем как db, так и client для возможного закрытия соединения
    } catch (error) {
        console.error('Ошибка при подключении к MongoDB:', error);
        throw new Error('Не удалось подключиться к базе данных');
    }
}
