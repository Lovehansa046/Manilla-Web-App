// pages/api/products/index.js
import {getConnection} from "../../dbConnection/dbConnection"; // Убедитесь, что путь правильный

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
    } else {
        res.status(405).json({message: "Метод не поддерживается"});
    }
}
