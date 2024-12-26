import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import {getConnection} from '../dbConnection/dbConnection'; // Подключаем функцию подключения

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {username, password} = req.body;

        try {
            // Получаем подключение к базе данных
            const {db} = await getConnection();

            // Ищем пользователя в коллекции users
            const user = await db.collection('User').findOne({username});

            if (!user) {
                return res.status(401).json({message: 'Пользователь не найден'});
            }

            // Здесь можно добавить сравнение пароля, например, с bcrypt
            if (user.password !== password) {
                return res.status(401).json({message: 'Неверный пароль'});
            }

            // Генерация JWT токена
            const token = jwt.sign({username: user.username}, 'secretKey', {expiresIn: '1h'});

            // Установка токена в cookie
            res.setHeader('Set-Cookie', cookie.serialize('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Только в продакшн
                maxAge: 3600, // 1 час
                path: '/',
            }));

            return res.status(200).json({message: 'Аутентификация прошла успешно'});
        } catch (error) {
            return res.status(500).json({message: 'Ошибка сервера'});
        }
    } else {
        res.status(405).json({message: 'Метод не разрешен'});
    }
}
