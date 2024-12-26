import {NextResponse} from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
    try {
        const {token} = await req.json();

        if (!token) {
            return NextResponse.json({message: 'Токен не предоставлен'}, {status: 400});
        }

        console.log("Received Token:", token); // Логируем токен для отладки

        // Проверяем токен
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET не задан в переменных окружения');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded Token:", decoded); // Логируем результат декодирования

        return NextResponse.json({valid: true, decoded}, {status: 200});
    } catch (error: unknown) {
        console.error("Token verification failed:", error); // Логируем ошибку
        return NextResponse.json({message: 'Невалидный токен', error: String(error)}, {status: 401});
    }
}

