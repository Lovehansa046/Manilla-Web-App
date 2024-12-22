import {getConnection} from "../../dbConnection/dbConnection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();  // Загружаем переменные окружения

const JWT_SECRET = process.env.JWT_SECRET;  // Получаем секрет из переменной окружения

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET не задан в переменных окружения");
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {Email, Password} = req.body;

        if (!Email || !Password) {
            return res.status(400).json({message: "Необходимо указать email и пароль"});
        }

        try {
            // Получаем подключение к базе данных MongoDB
            const {db, client} = await getConnection();

            // Ищем пользователя по email
            const user = await db.collection("User").findOne({Email});

            if (!user) {
                return res.status(400).json({message: "Пользователь не найден"});
            }

            // Сравниваем пароль с хешированным
            const isPasswordValid = await bcrypt.compare(Password, user.Password);

            if (!isPasswordValid) {
                return res.status(400).json({message: "Неверный пароль"});
            }

            // Генерация JWT токена
            const token = jwt.sign(
                {userId: user._id, email: user.Email, role_id: user.role_id},
                JWT_SECRET, // Используем секрет из переменной окружения
                {expiresIn: '1h'} // Токен истекает через 1 час
            );

            // Устанавливаем cookie с токеном
            res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; Secure`);

            // Закрываем подключение к базе данных
            await client.close();

            return res.status(200).json({message: "Авторизация успешна"});
        } catch (error) {
            console.error("Ошибка при авторизации:", error);
            return res.status(500).json({message: "Ошибка при авторизации", error: error.message});
        }
    } else {
        return res.status(405).json({message: "Метод не поддерживается"});
    }
}
