// pages/api/products/index.js

import {getConnection} from "../../../backend/dbConnection/dbConnection";

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


// const ProductSchema = new mongoose.Schema({
//     name: String,
//     description: String,
//     price: String,
//     image: String,
// });

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {name, description, price, image, product_type_id, is_alcoholic, quantity_available} = req.body;

        // Проверка на наличие обязательных полей
        if (!name || !price || !product_type_id) {
            return res.status(400).json({message: "Необходимо указать имя, цену и тип продукта"});
        }

        try {
            // Подключаемся к базе данных MongoDB
            const {db} = await getConnection();

            // Добавляем новый продукт в коллекцию 'Product'
            const product = {
                name,
                description: description || null,
                price,
                image: image || null,
                product_type_id,
                is_alcoholic: is_alcoholic || false,
                quantity_available: quantity_available || 0
            };

            const result = await db.collection('Product').insertOne(product);

            // Отправляем успешный ответ
            return res.status(201).json({message: "Продукт успешно создан", productId: result.insertedId});
        } catch (error) {
            console.error("Ошибка при добавлении продукта:", error);
            return res.status(500).json({message: "Ошибка при добавлении продукта", error: error.message});
        }
    } else if (req.method === "GET") {
        const {type_product} = req.query;

        try {
            // Подключаемся к базе данных MongoDB
            const {db} = await getConnection();

            // Если type_product не передан, используем пустой запрос для получения всех продуктов
            const query = type_product ? {product_type_id: parseInt(type_product)} : {};

            // Получаем список продуктов, соответствующих фильтру
            const products = await db.collection('Product').find(query).toArray();

            // Отправляем успешный ответ с данными
            return res.status(200).json({products});
        } catch (error) {
            console.error("Ошибка при получении продуктов:", error);
            return res.status(500).json({message: "Ошибка при получении данных", error: error.message});
        }
    } else {
        res.status(405).json({message: "Метод не поддерживается"});
    }
}