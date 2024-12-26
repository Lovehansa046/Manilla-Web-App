import {getConnection} from '../../../../backend/dbConnection/dbConnection';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {ObjectId} from 'mongodb'; // Импорт ObjectId

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const FIXED_ROLE_ID = '676823d21e6062779cfd474e'; // Перманентный ID роли

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET не задан в переменных окружения');
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {FirstName, LastName, Email, Password} = req.body;

        if (!FirstName || !LastName || !Email || !Password) {
            return res.status(400).json({message: 'Необходимо указать все обязательные поля'});
        }

        try {
            // Проверка, существует ли уже пользователь с таким email
            const {db, client} = await getConnection();
            const usersCollection = db.collection('User');
            const existingUser = await usersCollection.findOne({Email});

            if (existingUser) {
                await client.close();
                return res.status(400).json({message: 'Пользователь с таким email уже существует'});
            }

            // Хешируем пароль перед сохранением
            const hashedPassword = await bcrypt.hash(Password, 10);

            // Проверка существования роли по фиксированному ID
            const rolesCollection = db.collection('Role');
            const role = await rolesCollection.findOne({_id: new ObjectId(FIXED_ROLE_ID)});

            if (!role) {
                await client.close();
                return res.status(500).json({message: 'Роль с заданным ID не найдена'});
            }

            // Добавляем нового пользователя с привязкой к роли
            const result = await usersCollection.insertOne({
                FirstName,
                LastName,
                Email,
                Password: hashedPassword,
                image: "http://dummyimage.com/150x150.jpg/99cccc",
                role_id: role._id, // Ссылка на роль
                createdAt: new Date(),
            });

            // Закрываем подключение
            await client.close();

            return res.status(201).json({message: 'Пользователь успешно создан', userId: result.insertedId});
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
            return res.status(500).json({message: 'Ошибка при добавлении пользователя', error: error.message});
        }
    } else {
        res.status(405).json({message: 'Метод не поддерживается'});
    }
}
