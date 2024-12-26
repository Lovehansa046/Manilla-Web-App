// /app/api/users/route.ts
import {getConnection} from "@/backend/dbConnection/dbConnection";
import bcrypt from "bcrypt";
import {NextResponse} from "next/server";

/**
 * @swagger
 * /api/users:
 *   post:
 *     description: Добавить нового пользователя и роль
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               Email:
 *                 type: string
 *                 format: email
 *               Password:
 *                 type: string
 *               image:
 *                 type: string
 *                 description: URL изображения пользователя
 *               roleName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь и роль успешно созданы
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *                   description: Идентификатор созданного пользователя
 *       400:
 *         description: Не указаны обязательные поля или email уже существует
 *       500:
 *         description: Ошибка при добавлении пользователя и роли
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Получить всех пользователей
 *     responses:
 *       200:
 *         description: Пользователи успешно получены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       FirstName:
 *                         type: string
 *                       LastName:
 *                         type: string
 *                       Email:
 *                         type: string
 *                       image:
 *                         type: string
 *                       role_id:
 *                         type: string
 *                       roleName:
 *                         type: string
 *       404:
 *         description: Пользователи не найдены
 *       500:
 *         description: Ошибка при извлечении пользователей
 */

// POST: Добавить нового пользователя и роль
export async function POST(req: Request) {
    const {FirstName, LastName, Email, Password, image, roleName} = await req.json();

    if (!FirstName || !LastName || !Email || !Password || !roleName) {
        return NextResponse.json({message: "Необходимо указать все обязательные поля"}, {status: 400});
    }

    try {
        const {db, client} = await getConnection();  // Получаем db и client

        // Проверяем, существует ли пользователь с таким email
        const existingUser = await db.collection("User").findOne({Email});

        if (existingUser) {
            return NextResponse.json({message: "Пользователь с таким email уже существует"}, {status: 400});
        }

        // Хеширование пароля перед сохранением в базу данных
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Проверяем, существует ли роль с таким названием
        const rolesCollection = db.collection("Role");
        let role = await rolesCollection.findOne({name: roleName});

        if (!role) {
            return NextResponse.json({message: "Ошибка при добавлении пользователя"}, {status: 400});
        }

        // Извлекаем role_id после того, как нашли или создали роль
        const role_id = role._id;

        // Добавление пользователя в коллекцию
        const result = await db.collection("User").insertOne({
            FirstName,
            LastName,
            Email,
            Password: hashedPassword,
            image,
            role_id, // Ссылаемся на роль в коллекции
        });

        // Закрытие подключения
        await client.close();

        return NextResponse.json({message: "Пользователь успешно создан", userId: result.insertedId}, {status: 201});
    } catch (error) {
        console.error("Ошибка при добавлении пользователя:", error);
        return NextResponse.json({message: "Ошибка при добавлении пользователя", error: String(error)}, {status: 500});
    }
}

// GET: Получить всех пользователей
export async function GET(req: Request) {
    try {
        const {db, client} = await getConnection();  // Получаем db и client

        // Получаем коллекцию пользователей
        const usersCollection = db.collection("User");

        // Извлекаем всех пользователей
        const users = await usersCollection.find().toArray();

        if (users.length === 0) {
            return NextResponse.json({message: "Пользователи не найдены"}, {status: 404});
        }

        // Закрытие подключения
        await client.close();

        return NextResponse.json({message: "Пользователи успешно получены", users}, {status: 200});
    } catch (error) {
        console.error("Ошибка при извлечении пользователей:", error);
        return NextResponse.json({message: "Ошибка при извлечении пользователей", error: String(error)}, {status: 500});
    }
}
