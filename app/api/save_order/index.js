import {getConnection} from "../../../backend/dbConnection/dbConnection";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET не задан в переменных окружения');
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

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {predicted_date, predicted_time, products, status} = req.body;
        const token = req.cookies.token; // Получаем токен из cookies

        if (!token) {
            return res.status(401).json({message: "Токен отсутствует"});
        }

        try {
            // Проверяем токен и получаем userId из него
            const decoded = jwt.verify(token, JWT_SECRET);
            const userId = decoded.userId; // userId из токена

            const {db, client} = await getConnection(); // Получаем подключение к MongoDB

            // Проверяем, существует ли пользователь с таким ID
            const user = await db.collection("User").findOne({_id: new ObjectId(userId)});
            if (!user) {
                return res.status(401).json({message: "Пользователь не найден"});
            }

            // Вставляем новый заказ в коллекцию "orders"
            const ordersCollection = db.collection("orders");
            const result = await ordersCollection.insertOne({
                user_id: new ObjectId(userId),
                predicted_date,
                predicted_time,
                products,
                status: status || 'pending', // Статус по умолчанию
                created_at: new Date(), // Добавляем текущую дату и время
            });

            // Закрываем соединение с базой данных
            await client.close();

            return res.status(201).json({
                message: "Заказ успешно создан",
                orderId: result.insertedId.toString(),
            });
        } catch (error) {
            console.error("Ошибка при добавлении заказа:", error);
            return res.status(500).json({
                message: "Ошибка при добавлении заказа",
                error: error.message || "Неизвестная ошибка",
            });
        }
    } else if (req.method === "GET") {
        try {
            const {db, client} = await getConnection(); // Получаем подключение к MongoDB

            // Получаем все заказы из коллекции "orders"
            const ordersCollection = db.collection("orders");
            const orders = await ordersCollection.find().toArray();

            // Закрываем соединение с базой данных
            await client.close();

            return res.status(200).json({orders});
        } catch (error) {
            console.error("Ошибка при получении заказов:", error);
            return res.status(500).json({
                message: "Ошибка при получении заказов",
                error: error.message || "Неизвестная ошибка",
            });
        }
    } else {
        return res.status(405).json({message: "Метод не поддерживается"});
    }
}
