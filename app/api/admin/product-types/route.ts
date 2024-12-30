// /app/api/product-types/route.ts
import {getConnection} from "@/backend/dbConnection/dbConnection";
import {NextResponse} from "next/server";

/**
 * @swagger
 * /api/product-types:
 *   post:
 *     description: Добавить новый тип продукта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Тип продукта успешно создан
 *       400:
 *         description: Не указано имя типа продукта
 *       500:
 *         description: Ошибка при добавлении типа продукта
 *   get:
 *     description: Получить список всех типов продуктов
 *     responses:
 *       200:
 *         description: Список типов продуктов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Ошибка при получении типов продуктов
 */

// POST: Добавить новый тип продукта
export async function POST(req: Request) {
    const {name, description} = await req.json();

    // Проверка на наличие обязательных полей
    if (!name) {
        return NextResponse.json({message: "Необходимо указать имя типа продукта"}, {status: 400});
    }

    try {
        const {db, client} = await getConnection();  // Получаем db и client

        // Запрос для добавления нового типа продукта
        const productType = {name, description: description || null};
        const result = await db.collection('Product_type').insertOne(productType);

        // Закрытие подключения
        await client.close();

        return NextResponse.json({
            message: 'Тип продукта успешно создан',
            productTypeId: result.insertedId
        }, {status: 201});
    } catch (error) {
        console.error("Ошибка при добавлении типа продукта:", error);
        return NextResponse.json({message: "Ошибка при добавлении типа продукта", error: String(error)}, {status: 500});
    }
}

// GET: Получить список всех типов продуктов
export async function GET() {
    try {
        const {db, client} = await getConnection();  // Получаем db и client

        // Запрос для получения всех типов продуктов
        const result = await db.collection('Product_type').find().toArray();

        // Закрытие подключения
        await client.close();

        return NextResponse.json(result, {status: 200});
    } catch (error) {
        console.error("Ошибка при получении типов продуктов:", error);
        return NextResponse.json({
            message: "Ошибка при получении типов продуктов",
            error: String(error)
        }, {status: 500});
    }
}
