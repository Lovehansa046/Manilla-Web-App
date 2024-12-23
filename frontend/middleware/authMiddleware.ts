// middleware/authMiddleware.ts
import {NextResponse} from 'next/server';

export async function authMiddleware(req: any) {
    let token = req.cookies.get('token')?.value; // Извлекаем токен
    const url = req.nextUrl.clone();

    console.log("Token from cookies:", token); // Логируем токен

    // Если токена нет и пользователь не на страницах логина или регистрации, редиректим на страницу входа
    if (!token && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/register')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Если токен есть, проверяем его
    if (token) {
        const res = await fetch(`${req.nextUrl.origin}/api/auth/verifyToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token}), // Отправляем токен как строку
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Token verification failed:", data.message); // Логируем ошибку
            return NextResponse.redirect(new URL('/login', req.url));
        }

        console.log("Token is valid:", data); // Логируем успешную верификацию
    }

    return NextResponse.next(); // Если все в порядке, продолжаем обработку запроса
}
