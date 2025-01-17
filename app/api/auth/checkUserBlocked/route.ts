import {NextResponse} from 'next/server';
import {getConnection} from '@/backend/dbConnection/dbConnection';
import {ObjectId} from 'mongodb';
import jwt, {JwtPayload} from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET не задан в переменных окружения');
}

function getCookie(req: Request, name: string): string | undefined {
    const cookies = req.headers.get('cookie');
    if (!cookies) return undefined;

    const value = cookies
        .split('; ')
        .find((cookie) => cookie.startsWith(`${name}=`));

    return value ? value.split('=')[1] : undefined;
}

export async function POST(req: Request) {
    if (req.method !== 'POST') {
        return NextResponse.json({message: 'Метод не поддерживается'}, {status: 405});
    }

    const token = getCookie(req, 'token'); // Получаем токен из cookies

    if (!token) {
        return NextResponse.json({message: 'Токен отсутствует'}, {status: 401});
    }

    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET не задан в переменных окружения');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Проверяем токен

        if (typeof decoded === 'object' && decoded !== null) {
            const {db, client} = await getConnection();

            const user = await db.collection('User').findOne({
                _id: new ObjectId((decoded as JwtPayload).userId), // Проверка безопасного извлечения userId
                token: token, // Убедимся, что токен совпадает
            });

            if (!user) {
                await client.close();
                return NextResponse.json({message: 'Пользователь не найден или токен недействителен'}, {status: 401});
            }

            // Проверка на блокировку пользователя
            if (user.isBlocked === true) {
                await client.close(); // Закрываем клиент перед возвратом ответа
                return NextResponse.json({
                    message: 'Пользователь заблокирован',
                    isBlocked: user.isBlocked, // Возвращаем статус блокировки
                }, {status: 403}); // Статус 403 — доступ запрещен
            }

            await client.close(); // Закрываем клиент перед возвратом успешного ответа
            // Если пользователь не заблокирован
            return NextResponse.json({
                message: 'Пользователь не заблокирован',
                isBlocked: false,
            }, {status: 200});
        } else {
            return NextResponse.json({message: 'Некорректный токен'}, {status: 401});
        }
    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        return NextResponse.json({message: 'Неверный или просроченный токен'}, {status: 401});
    }
}
