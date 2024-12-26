import {NextResponse} from 'next/server';
import {getConnection} from '@/backend/dbConnection/dbConnection';
import {ObjectId} from 'mongodb';
import jwt, {JwtPayload} from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_ROLE_ID = new ObjectId("6768119b5157a6cf573ca551"); // Статический ID роли администратора

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

        // Проверяем, что decoded - это объект (JwtPayload), а не строка
        if (typeof decoded === 'object' && decoded !== null) {
            const {db, client} = await getConnection();

            const user = await db.collection('User').findOne({
                _id: new ObjectId((decoded as JwtPayload).userId), // Теперь это безопасно
                token: token, // Убедимся, что токен совпадает
            });

            await client.close();

            if (!user) {
                return NextResponse.json({message: 'Пользователь не найден или токен недействителен'}, {status: 401});
            }

            // Проверяем, совпадает ли role_id пользователя с ADMIN_ROLE_ID
            if (user.role_id?.toString() === ADMIN_ROLE_ID.toString()) {
                return NextResponse.json({
                    message: 'Проверка успешна',
                    role_id: ADMIN_ROLE_ID.toString(), // Возвращаем только ID роли администратора
                }, {status: 200});
            } else {
                return NextResponse.json({
                    message: 'Проверка успешна',
                    role_id: user.role_id.toString(), // Возвращаем ID роли обычного пользователя
                }, {status: 200});
            }
        } else {
            return NextResponse.json({message: 'Некорректный токен'}, {status: 401});
        }
    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        return NextResponse.json({message: 'Неверный или просроченный токен'}, {status: 401});
    }
}
