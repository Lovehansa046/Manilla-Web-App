import {NextResponse} from 'next/server';

export async function middleware(req: any) {
    const token = req.cookies.get('token')?.value; // Извлекаем токен из cookies
    const url = req.nextUrl.clone();

    console.log("Token from cookies:", token); // Логируем токен

    // Если токен отсутствует, и пользователь не на страницах логина/регистрации, перенаправляем на /login
    if (!token && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/register')) {
        console.log("Token not found, redirecting to login.");
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        // Верификация токена
        if (token) {
            const res = await fetch(`${req.nextUrl.origin}/api/auth/verifyToken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token}), // Отправляем токен для верификации
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Token verification failed:", data.message); // Логируем ошибку верификации
                return NextResponse.redirect(new URL('/login', req.url));
            }

            console.log("Token is valid:", data); // Логируем успешную верификацию

            // Проверка блокировки пользователя (раньше, чем роль)
            const isBlockedUser = await fetch(`${req.nextUrl.origin}/api/auth/checkUserBlocked`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `token=${token}`,
                },
            });

            const isBlockedData = await isBlockedUser.json();
            console.log(isBlockedData)
            const isBlocked = isBlockedData.isBlocked; // Предполагается, что `status` уже содержит boolean

            // Если пользователь заблокирован, перенаправляем на страницу /blocked с кодом 403
            if (isBlocked === true) {
                console.log("User is blocked");
                return NextResponse.redirect(new URL('/blocked', req.url)); // Страница с уведомлением о блокировке
            }

            // Проверка на роль будет выполняться только если пользователь не заблокирован
            const roleRes = await fetch(`${req.nextUrl.origin}/api/auth/checkRole`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `token=${token}`,
                },
            });

            if (!roleRes.ok) {
                console.log("Role check failed");
                return NextResponse.redirect(new URL('/login', req.url));
            }

            const roleData = await roleRes.json();
            const roleId = roleData.role_id;

            console.log("Received role_id:", roleId); // Логируем полученный role_id

            // Сопоставляем role_id с нужной ролью
            const adminRoleId = '6768119b5157a6cf573ca551'; // ID роли админа

            // Проверяем доступ на основе роли
            if (roleId === adminRoleId) {
                console.log("Role is admin, checking page access");
                // Администратору доступны только страницы /admin/:path*
                if (!url.pathname.startsWith('/admin')) {
                    console.log("Admin tried to access a non-admin page, redirecting to /admin");
                    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
                }
            } else if (roleId !== adminRoleId) {
                console.log("Role is user, checking page access");
                // Обычному пользователю запрещены страницы /admin/:path*
                if (url.pathname.startsWith('/admin')) {
                    console.log("User tried to access an admin page, redirecting to /");
                    return NextResponse.redirect(new URL('/', req.url));
                }
            } else {
                console.log("Unknown role_id, redirecting to /login");
                return NextResponse.redirect(new URL('/login', req.url));
            }
        }
    } catch (error) {
        console.error("Error in middleware:", error);
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Если все проверки прошли успешно, продолжаем обработку запроса
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Страницы, доступные всем пользователям
        '/login',
        '/register',

        // Страницы админов
        '/admin/:path*',

        // Страницы для пользователей
        '/',
        '/home',
        '/menu/:path*',
        '/bucket',
        '/about',
        '/account/:path*',
    ],
};
