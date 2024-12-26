import {getConnection} from '../../../../backend/dbConnection/dbConnection';
import {ObjectId} from 'mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_ROLE_ID = new ObjectId("6768119b5157a6cf573ca551"); // Статический ID роли администратора

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET не задан в переменных окружения');
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Метод не поддерживается'});
    }

    const token = req.cookies.token; // Получаем токен из cookies

    if (!token) {
        return res.status(401).json({message: 'Токен отсутствует'});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Проверяем токен
        const {db, client} = await getConnection();

        const user = await db.collection('User').findOne({
            _id: new ObjectId(decoded.userId), // Проверяем ID пользователя
            token: token, // Убедимся, что токен совпадает
        });

        await client.close();

        if (!user) {
            return res.status(401).json({message: 'Пользователь не найден или токен недействителен'});
        }

        // Проверяем, совпадает ли role_id пользователя с ADMIN_ROLE_ID
        if (user.role_id?.toString() === ADMIN_ROLE_ID.toString()) {
            return res.status(200).json({
                message: 'Проверка успешна',
                role_id: ADMIN_ROLE_ID.toString(), // Возвращаем только ID роли администратора
            });
        } else {
            return res.status(200).json({
                message: 'Проверка успешна',
                role_id: user.role_id.toString(), // Возвращаем ID роли обычного пользователя
            });
        }
    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        return res.status(401).json({message: 'Неверный или просроченный токен'});
    }
}
