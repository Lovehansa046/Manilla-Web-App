import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectionConfig = {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME,
};

if (!connectionConfig.uri || !connectionConfig.dbName) {
    throw new Error('Ошибка: Проверьте, что переменные MONGODB_URI и MONGODB_DB_NAME установлены в .env');
}

export async function getConnection() {
    let client;
    try {
        client = new MongoClient(connectionConfig.uri);
        await client.connect();
        console.log('Успешное подключение к MongoDB');
        const db = client.db(connectionConfig.dbName);
        return {db, client};
    } catch (error) {
        console.error('Ошибка при подключении к MongoDB:', error);
        throw new Error('Не удалось подключиться к базе данных');
    }
}
