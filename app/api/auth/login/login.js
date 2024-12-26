import {getConnection} from '../../../../backend/dbConnection/dbConnection';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

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
            const {db, client} = await getConnection();

            // Находим пользователя по Email
            const user = await db.collection("User").findOne({Email});

            if (!user) {
                return res.status(400).json({message: "Пользователь не найден"});
            }

            // Проверка пароля
            const isPasswordValid = await bcrypt.compare(Password, user.Password);

            if (!isPasswordValid) {
                return res.status(400).json({message: "Неверный пароль"});
            }

            // Генерация JWT токена
            const token = jwt.sign(
                {userId: user._id, email: user.Email, role_id: user.role_id},
                JWT_SECRET,
                {expiresIn: "1h"}
            );

            // Обновление токена и времени истечения в таблице User
            const tokenExpiresAt = new Date(Date.now() + 3600 * 1000); // Токен истекает через 1 час

            await db.collection("User").updateOne(
                {_id: user._id},
                {$set: {token, tokenExpiresAt}}
            );

            // Устанавливаем cookie с токеном
            res.setHeader("Set-Cookie", [
                `token=${token}; HttpOnly; Path=/; Max-Age=3600; Secure`,
            ]);

            // Закрываем подключение
            await client.close();

            return res.status(200).json({
                message: "Авторизация успешна",
                token,
                expiresAt: tokenExpiresAt,
            });
        } catch (error) {
            console.error("Ошибка при авторизации:", error);
            return res.status(500).json({message: "Ошибка при авторизации", error: error.message});
        }
    } else {
        return res.status(405).json({message: "Метод не поддерживается"});
    }
}

async function cleanExpiredTokens() {
    try {
        const {db, client} = await getConnection();

        // Удаляем истекшие токены
        const result = await db.collection("User").updateMany(
            {tokenExpiresAt: {$lte: new Date()}},
            {$set: {token: null, tokenExpiresAt: null}}
        );

        console.log(`Удалено истекших токенов: ${result.modifiedCount}`);
        await client.close();
    } catch (error) {
        console.error("Ошибка при очистке истекших токенов:", error);
    }
}

// Запускаем процесс очистки каждые 5 минут
setInterval(cleanExpiredTokens, 5 * 60 * 1000);
