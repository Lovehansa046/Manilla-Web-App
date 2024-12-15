import {getConnection} from "../../dbConnection/dbConnection";

/**
 * @swagger
 * /api/orders:
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
 *                   type: integer
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
 *                         type: integer
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

        // Проверка на наличие обязательных полей
        if (!user_id || !predicted_date || !predicted_time || !products || products.length === 0) {
            return res.status(400).json({message: "Необходимо указать все обязательные поля"});
        }

        // Проверка на правильность типа данных
        if (typeof user_id !== 'number') {
            return res.status(400).json({message: "user_id должен быть числом"});
        }

        if (!Array.isArray(products)) {
            return res.status(400).json({message: "products должен быть массивом"});
        }

        // Проверка формата даты (предполагаем, что дата в формате YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(predicted_date)) {
            return res.status(400).json({message: "Неверный формат predicted_date. Ожидается YYYY-MM-DD"});
        }

        try {
            // Подключаемся к базе данных
            const connection = await getConnection();

            // Запрос для добавления нового заказа
            const query = `
                INSERT INTO Predicted_Orders (user_id, predicted_date, predicted_time, products, status)
                VALUES (?, ?, ?, ?, ?)
            `;

            const values = [
                user_id,
                predicted_date,
                predicted_time,
                JSON.stringify(products), // Преобразуем список продуктов в строку JSON
                status || 'pending' // статус по умолчанию
            ];

            // Выполняем запрос
            const [result] = await connection.execute(query, values);

            // Отправляем успешный ответ
            return res.status(201).json({message: "Заказ успешно создан", orderId: result.insertId});
        } catch (error) {
            console.error("Ошибка при добавлении заказа:", error);
            return res.status(500).json({
                message: "Ошибка при добавлении заказа",
                error: error.message || "Неизвестная ошибка"
            });
        }
    } else if (req.method === "GET") {
        try {
            // Подключаемся к базе данных
            const connection = await getConnection();

            // Запрос для получения всех заказов
            const query = 'SELECT * FROM Predicted_Orders';

            const [rows] = await connection.execute(query);

            // Обрабатываем поле products
            const orders = rows.map(order => {
                return {
                    ...order,
                    products: JSON.parse(order.products)  // Преобразуем строку обратно в массив
                };
            });

            // Отправляем успешный ответ с данными
            return res.status(200).json({orders});
        } catch (error) {
            console.error("Ошибка при получении заказов:", error);
            return res.status(500).json({
                message: "Ошибка при получении заказов",
                error: error.message || "Неизвестная ошибка"
            });
        }
    } else {
        res.status(405).json({message: "Метод не поддерживается"});
    }
}
