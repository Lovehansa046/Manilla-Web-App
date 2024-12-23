import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateAdmin = (handler) => async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({message: "Неавторизованный доступ"});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role_id !== 2) {
            return res.status(403).json({message: "Доступ запрещен"});
        }
        req.user = decoded;
        return handler(req, res);
    } catch (error) {
        return res.status(401).json({message: "Неверный токен"});
    }
};
