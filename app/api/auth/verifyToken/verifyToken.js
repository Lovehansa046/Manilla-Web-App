// pages/api/auth/verifyToken.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
    if (req.method === 'POST') {
        const {token} = req.body;

        if (!token) {
            return res.status(400).json({message: 'Токен не предоставлен'});
        }

        console.log("Received Token:", token); // Логируем токен для отладки

        try {
            // Проверяем токен
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log("Decoded Token:", decoded); // Логируем результат декодирования

            return res.status(200).json({valid: true, decoded});
        } catch (error) {
            console.error("Token verification failed:", error); // Логируем ошибку
            return res.status(401).json({message: 'Невалидный токен', error: error.message});
        }
    } else {
        return res.status(405).json({message: 'Метод не поддерживается'});
    }
}


