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
 */
export default async function handler(req, res) {
    if (req.method === "POST") {
        const {name, description} = req.body;

        // Проверка на наличие обязательных полей
        if (!name) {
            return res.status(400).json({message: "Необходимо указать имя типа продукта"});
        }

        try {
            // Подключаемся к базе данных
            const connection = await getConnection();

            // Запрос для добавления нового типа продукта
            const query = `
                INSERT INTO Product_type (name, description)
                VALUES (?, ?)
            `;

            const values = [name, description || null];

            // Выполняем запрос
            const [result] = await connection.execute(query, values);

            return res.status(201).json({message: "Тип продукта успешно создан", productTypeId: result.insertId});
        } catch (error) {
            console.error("Ошибка при добавлении типа продукта:", error);
            return res.status(500).json({message: "Ошибка при добавлении типа продукта", error: error.message});
        }
    } else {
        res.status(405).json({message: "Метод не поддерживается"});
    }
}
