// pages/api/product-types/index.js
import {getConnection} from "../../dbConnection/dbConnection"; // Убедитесь, что путь правильный

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

            const values = [
                name,
                description || null
            ];

            // Выполняем запрос
            const [result] = await connection.execute(query, values);

            // Отправляем успешный ответ
            return res.status(201).json({message: "Тип продукта успешно создан", productTypeId: result.insertId});
        } catch (error) {
            console.error("Ошибка при добавлении типа продукта:", error);
            return res.status(500).json({message: "Ошибка при добавлении типа продукта", error: error.message});
        }
    } else {
        res.status(405).json({message: "Метод не поддерживается"});
    }
}
