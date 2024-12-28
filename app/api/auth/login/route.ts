import {NextResponse} from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {getConnection} from '@/backend/dbConnection/dbConnection';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
    try {
        const {Email, Password} = await req.json();

        if (!Email || !Password) {
            return NextResponse.json({message: 'Необходимо указать email и пароль'}, {status: 400});
        }

        const {db} = await getConnection();
        const user = await db.collection('User').findOne({Email});

        if (!user) {
            return NextResponse.json({message: 'Пользователь не найден'}, {status: 400});
        }

        const isPasswordValid = await bcrypt.compare(Password, user.Password);

        if (!isPasswordValid) {
            return NextResponse.json({message: 'Неверный пароль'}, {status: 400});
        }

        if (!JWT_SECRET) {
            return
        }

        const token = jwt.sign(
            {userId: user._id, email: user.Email, role_id: user.role_id},
            JWT_SECRET,
            {expiresIn: '1h'}
        );


        const tokenExpiresAt = new Date(Date.now() + 3600 * 1000); // Токен истекает через 1 час

        await db.collection('User').updateOne(
            {_id: user._id},
            {$set: {token, user_id: user._id, tokenExpiresAt}}
        );

        // Установка токена в cookie
        const response = NextResponse.json({
            message: 'Авторизация успешна',
            token, user_id: user._id,
            expiresAt: tokenExpiresAt
        }, {status: 200});
        response.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; Secure`);

        return response;

    } catch (error) {
        if (error instanceof Error) {
            console.error('Ошибка при авторизации:', error.message);
            return NextResponse.json({message: 'Ошибка при авторизации', error: error.message}, {status: 500});
        } else {
            console.error('Неизвестная ошибка:', error);
            return NextResponse.json({message: 'Неизвестная ошибка', error: String(error)}, {status: 500});
        }
    }
}
