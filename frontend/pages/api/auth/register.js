import {getConnection} from '../../dbConnection/dbConnection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET не задан в переменных окружения');
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {FirstName, LastName, Email, Password, image, role_id} = req.body;

        if (!FirstName || !LastName || !Email || !Password || !role_id) {
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

            // Проверка существования роли и создание ее, если нужно
            const rolesCollection = db.collection('Role');
            let role = await rolesCollection.findOne({id: role_id});

            if (!role) {
                role = await rolesCollection.insertOne({
                    id: role_id,
                    name: `Role_${role_id}`,
                });
            }

            // Добавляем нового пользователя
            const result = await usersCollection.insertOne({
                FirstName,
                LastName,
                Email,
                Password: hashedPassword,
                image,
                role_id: role._id, // Ссылаемся на роль в коллекции
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
