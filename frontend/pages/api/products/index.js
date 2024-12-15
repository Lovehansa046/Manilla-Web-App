// pages/api/products/index.js
import {getConnection} from "../../dbConnection/dbConnection";

/**
 * @swagger
 * /api/products:
 *   post:
 *     description: Добавить новый продукт
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
 *               price:
 *                 type: number
 *                 format: float
 *               image:
 *                 type: string
 *               product_type_id:
 *                 type: integer
 *               is_alcoholic:
 *                 type: boolean
 *               quantity_available:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Продукт успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 productId:
 *                   type: integer
 *       400:
 *         description: Не указано имя, цена или тип продукта
 *       500:
 *         description: Ошибка при добавлении продукта
 *   get:
 *     description: Получить список всех продуктов или отфильтрованных по типу
 *     parameters:
 *       - in: query
 *         name: type_product
 *         schema:
 *           type: string
 *         description: Тип продукта для фильтрации
 *     responses:
 *       200:
 *         description: Список продуктов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                         format: float
 *                       image:
 *                         type: string
 *                       product_type_id:
 *                         type: integer
 *                       is_alcoholic:
 *                         type: boolean
 *                       quantity_available:
 *                         type: integer
 *       500:
 *         description: Ошибка при получении данных
 */
export default async function handler(req, res) {
    if (req.method === "POST") {
        const {name, description, price, image, product_type_id, is_alcoholic, quantity_available} = req.body;

        // Проверка на наличие обязательных полей
        if (!name || !price || !product_type_id) {
            return res.status(400).json({message: "Необходимо указать имя, цену и тип продукта"});
        }

        try {
            // Подключаемся к базе данных
            const connection = await getConnection();

            // Запрос для добавления нового продукта
            const query = `
                INSERT INTO Product (name, description, price, image, product_type_id, is_alcoholic, quantity_available)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                name,
                description || null,
                price,
                image || null,
                product_type_id,
                is_alcoholic || false,
                quantity_available || 0
            ];

            // Выполняем запрос
            const [result] = await connection.execute(query, values);

            // Отправляем успешный ответ
            return res.status(201).json({message: "Продукт успешно создан", productId: result.insertId});
        } catch (error) {
            console.error("Ошибка при добавлении продукта:", error);
            return res.status(500).json({message: "Ошибка при добавлении продукта", error: error.message});
        }
    } else if (req.method === "GET") {
        const {type_product} = req.query;

        try {
            // Подключаемся к базе данных
            const connection = await getConnection();

            // Если type_product не передан, используем null или пустое значение
            const query = type_product
                ? 'SELECT * FROM Product WHERE product_type_id = ?' // Фильтруем по типу продукта
                : 'SELECT * FROM Product'; // Если нет фильтра, выбираем все продукты

            // Если type_product не передан, передаем null в запрос
            const [rows] = await connection.execute(query, type_product ? [type_product] : []);

            // Отправляем успешный ответ с данными
            return res.status(200).json({products: rows});
        } catch (error) {
            console.error("Ошибка при получении продуктов:", error);
            return res.status(500).json({message: "Ошибка при получении данных", error: error.message});
        }
    } else {
        res.status(405).json({message: "Метод не поддерживается"});
    }
}
