// pages/api/product-types/index.js
import {getConnection} from "../../dbConnection/dbConnection";

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
export default async function handler(req, res) {
    if (req.method === "POST") {
        const {name, description} = req.body;

        // Проверка на наличие обязательных полей
        if (!name) {
            return res.status(400).json({message: "Необходимо указать имя типа продукта"});
        }

        try {
            const {db, client} = await getConnection();  // Получаем db и client

            // Запрос для добавления нового типа продукта
            const productType = {name, description: description || null};
            const result = await db.collection('Product_type').insertOne(productType);

            // Закрытие подключения к MongoDB после выполнения запроса
            await client.close();

            return res.status(201).json({message: 'Тип продукта успешно создан', productTypeId: result.insertedId});
        } catch (error) {
            console.error("Ошибка при добавлении типа продукта:", error);
            return res.status(500).json({message: "Ошибка при добавлении типа продукта", error: error.message});
        }
    } else if (req.method === "GET") {
        try {
            const {db, client} = await getConnection();  // Получаем db и client

            // Запрос для получения всех типов продуктов
            const result = await db.collection('Product_type').find().toArray();

            // Закрытие подключения после выполнения запроса
            await client.close();

            return res.status(200).json(result);
        } catch (error) {
            console.error("Ошибка при получении типов продуктов:", error);
            return res.status(500).json({message: "Ошибка при получении типов продуктов", error: error.message});
        }
    } else {
        res.status(405).json({message: "Метод не поддерживается"});
    }
}
