import {getConnection} from '@/backend/dbConnection/dbConnection';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {ObjectId} from 'mongodb';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET не задан в переменных окружения');
}

export async function POST(req: Request) {
    const {FirstName, LastName, Email, Password, RoleId} = await req.json();

    if (!FirstName || !LastName || !Email || !Password || !RoleId) {
        return new Response(
            JSON.stringify({message: 'Необходимо указать все обязательные поля'}),
            {status: 400}
        );
    }

    try {
        // Проверка, существует ли уже пользователь с таким email
        const {db, client} = await getConnection();
        const usersCollection = db.collection('User');
        const rolesCollection = db.collection('Role');

        const existingUser = await usersCollection.findOne({Email});

        if (existingUser) {
            await client.close();
            return new Response(
                JSON.stringify({message: 'Пользователь с таким email уже существует'}),
                {status: 400}
            );
        }

        // Проверка существования роли по указанному ID
        const role = await rolesCollection.findOne({_id: new ObjectId(RoleId)});

        if (!role) {
            await client.close();
            return new Response(
                JSON.stringify({message: 'Роль с заданным ID не найдена'}),
                {status: 400}
            );
        }

        // Хешируем пароль перед сохранением
        const hashedPassword = await bcrypt.hash(Password, 10);

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

/**
 * @swagger
 * /api/admin/users/create:
 *   post:
 *     tags:
 *       - Users
 *     description: Создание нового пользователя администратором. Роль пользователя выбирается из списка.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - FirstName
 *               - LastName
 *               - Email
 *               - Password
 *               - RoleId
 *             properties:
 *               FirstName:
 *                 type: string
 *                 description: Имя пользователя
 *               LastName:
 *                 type: string
 *                 description: Фамилия пользователя
 *               Email:
 *                 type: string
 *                 description: Электронная почта пользователя
 *               Password:
 *                 type: string
 *                 description: Пароль пользователя
 *               RoleId:
 *                 type: string
 *                 description: ID роли пользователя
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Ошибка в запросе
 *       500:
 *         description: Ошибка сервера
 */
