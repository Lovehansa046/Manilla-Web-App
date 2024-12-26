import {NextRequest, NextResponse} from "next/server";
import {getConnection} from "@/backend/dbConnection/dbConnection";
import jwt, {JwtPayload} from "jsonwebtoken";
import {ObjectId} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET не задан в переменных окружения");
}

interface Product {
    product_id: number;
    quantity: number;
}

interface OrderRequest {
    predicted_date: string;
    predicted_time: string;
    products: Product[];
    status: "pending" | "completed" | "cancelled";
}

/**
 * @swagger
 * /api/save_order:
 *   post:
 *     description: Добавить новый заказ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               predicted_date:
 *                 type: string
 *                 format: date
 *               predicted_time:
 *                 type: string
 *                 format: time
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *     responses:
 *       201:
 *         description: Заказ успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orderId:
 *                   type: string
 *       400:
 *         description: Не указаны обязательные поля
 *       500:
 *         description: Ошибка при добавлении заказа
 */

export async function POST(req: NextRequest) {
    const {predicted_date, predicted_time, products, status}: OrderRequest = await req.json();
    const token = req.cookies.get("token")?.value; // Получаем значение токена через .value

    if (!token) {
        return NextResponse.json({message: "Токен отсутствует"}, {status: 401});
    }


    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET не задан в переменных окружения");
    }

    try {

        // Проверка токена и получение userId
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const userId = decoded.userId;

        const {db, client} = await getConnection();

        // Проверка существования пользователя
        const user = await db.collection("User").findOne({_id: new ObjectId(userId)});
        if (!user) {
            return NextResponse.json({message: "Пользователь не найден"}, {status: 401});
        }

        // Вставка заказа в коллекцию
        const ordersCollection = db.collection("orders");
        const result = await ordersCollection.insertOne({
            user_id: new ObjectId(userId),
            predicted_date,
            predicted_time,
            products,
            status: status || 'pending',
            created_at: new Date(),
        });

        await client.close();

        return NextResponse.json({
            message: "Заказ успешно создан",
            orderId: result.insertedId.toString(),
        }, {status: 201});
    } catch (error) {
        console.error("Ошибка при добавлении заказа:", error);
        return NextResponse.json({
            message: "Ошибка при добавлении заказа",
            error: String(error),
        }, {status: 500});
    }
}

export async function GET(req: NextRequest) {
    try {
        const {db, client} = await getConnection();

        // Получение всех заказов
        const ordersCollection = db.collection("orders");
        const orders = await ordersCollection.find().toArray();

        await client.close();

        return NextResponse.json({orders});
    } catch (error) {
        console.error("Ошибка при получении заказов:", error);
        return NextResponse.json({
            message: "Ошибка при получении заказов",
            error: String(error),
        }, {status: 500});
    }
}
