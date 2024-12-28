import {getConnection} from '@/backend/dbConnection/dbConnection';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {ObjectId} from 'mongodb'; // Импорт ObjectId

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const FIXED_ROLE_ID = '676823d21e6062779cfd474e'; // Перманентный ID роли

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET не задан в переменных окружения');
}

export async function POST(req: Request) {
    const {FirstName, LastName, Email, Password} = await req.json();

    if (!FirstName || !LastName || !Email || !Password) {
        return new Response(
            JSON.stringify({message: 'Необходимо указать все обязательные поля'}),
            {status: 400}
        );
    }

    try {
        // Проверка, существует ли уже пользователь с таким email
        const {db, client} = await getConnection();
        const usersCollection = db.collection('User');
        const existingUser = await usersCollection.findOne({Email});

        if (existingUser) {
            await client.close();
            return new Response(
                JSON.stringify({message: 'Пользователь с таким email уже существует'}),
                {status: 400}
            );
        }

        // Хешируем пароль перед сохранением
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Проверка существования роли по фиксированному ID
        const rolesCollection = db.collection('Role');
        const role = await rolesCollection.findOne({_id: new ObjectId(FIXED_ROLE_ID)});

        if (!role) {
            await client.close();
            return new Response(
                JSON.stringify({message: 'Роль с заданным ID не найдена'}),
                {status: 500}
            );
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

        return new Response(
            JSON.stringify({message: 'Пользователь успешно создан', userId: result.insertedId}),
            {status: 201}
        );
    } catch (error) {
        console.error('Ошибка при добавлении пользователя:', error);
        return new Response(
            JSON.stringify({message: 'Ошибка при добавлении пользователя', error: String(error)}),
            {status: 500}
        );
    }
}
