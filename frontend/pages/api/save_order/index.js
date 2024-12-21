import {getConnection} from "../../dbConnection/dbConnection";

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
 *               user_id:
 *                 type: integer
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
 *   get:
 *     description: Получить список всех заказов
 *     responses:
 *       200:
 *         description: Список заказов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       user_id:
 *                         type: integer
 *                       predicted_date:
 *                         type: string
 *                       predicted_time:
 *                         type: string
 *                       status:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             product_id:
 *                               type: integer
 *                             quantity:
 *                               type: integer
 *       500:
 *         description: Ошибка при получении заказов
 */

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {user_id, predicted_date, predicted_time, products, status} = req.body;

        if (!user_id || !predicted_date || !predicted_time || !products || products.length === 0) {
            return res.status(400).json({message: "Необходимо указать все обязательные поля"});
        }

        try {
            const {db, client} = await getConnection(); // Получаем подключение к MongoDB

            // Вставляем новый заказ в коллекцию "orders"
            const ordersCollection = db.collection("orders");

            const result = await ordersCollection.insertOne({
                user_id,
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
