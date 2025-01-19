/**
 * @swagger
 * /api/role:
 *   post:
 *     summary: Создание новой роли
 *     description: Этот метод создает новую роль с указанным именем и описанием.
 *     requestBody:
 *       description: Данные роли, которые нужно создать
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleName
 *               - roleDescription
 *             properties:
 *               roleName:
 *                 type: string
 *                 description: Название роли
 *               roleDescription:
 *                 type: string
 *                 description: Описание роли
 *     responses:
 *       201:
 *         description: Роль успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Роль успешно создана
 *                 role:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64b0f7f33b1d07e8e174d1a2"
 *                     roleName:
 *                       type: string
 *                       example: "admin"
 *                     roleDescription:
 *                       type: string
 *                       example: "Администратор с полными правами"
 *       400:
 *         description: Ошибка в запросе
 *       409:
 *         description: Роль с таким именем уже существует
 *       500:
 *         description: Ошибка сервера
 */

import {getConnection} from '@/backend/dbConnection/dbConnection';
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {roleName, roleDescription} = body;

        if (!roleName || !roleDescription) {
            return new Response(JSON.stringify({message: 'Все поля обязательны'}), {status: 400});
        }

        const {db, client} = await getConnection();

        const existingRole = await db.collection('Role').findOne({roleName});
        if (existingRole) {
            client.close();
            return new Response(JSON.stringify({message: 'Роль с таким именем уже существует'}), {status: 409});
        }

        const result = await db.collection('Role').insertOne({
            roleName,
            roleDescription,
            createdAt: new Date(),
        });

        client.close();

        return new Response(
            JSON.stringify({
                message: 'Роль успешно создана',
                role: {
                    id: result.insertedId,
                    roleName,
                    roleDescription,
                },
            }),
            {status: 201}
        );
    } catch (error) {
        console.error('Ошибка при создании роли:', error);
        return new Response(JSON.stringify({message: 'Ошибка сервера'}), {status: 500});
    }
}


export async function GET(req: Request) {
    try {
        const {db, client} = await getConnection();  // Получаем db и client

        // Получаем коллекцию пользователей
        const rolesCollection = db.collection("Role");

        // Извлекаем всех пользователей
        const roles = await rolesCollection.find().toArray();

        if (roles.length === 0) {
            return NextResponse.json({message: "Пользователи не найдены"}, {status: 404});
        }

        // Закрытие подключения
        await client.close();

        return NextResponse.json({message: "Пользователи успешно получены", roles}, {status: 200});
    } catch (error) {
        console.error("Ошибка при извлечении пользователей:", error);
        return NextResponse.json({message: "Ошибка при извлечении пользователей", error: String(error)}, {status: 500});
    }
}