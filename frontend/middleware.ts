// import {NextResponse} from 'next/server';
// import {authMiddleware} from './middleware/authMiddleware';
// import {roleMiddleware} from './middleware/roleMiddleware';
//
// export async function middleware(req: any) {
//     // Выполняем авторизацию
//     const authResponse = await authMiddleware(req);
//     if (authResponse) {
//         return authResponse; // Если авторизация не прошла, возвращаем ошибку или редирект
//     }
//
//     // Если авторизация прошла, сразу выполняем проверку роли
//     const roleResponse = await roleMiddleware(req);
//     if (roleResponse) {
//         return roleResponse; // Если роль не подходит, перенаправляем пользователя
//     }
//
//     return NextResponse.next(); // Если авторизация и роль прошли, продолжаем выполнение запроса
// }
//
// export const config = {
//     matcher: [
//         // Страницы, доступные всем пользователям
//         '/login',
//         '/register',
//
//         // Страницы админов
//         '/admin/:path*',
//
//         // Страницы для пользователей
//         '/',
//         '/home',
//         '/menu/:path*',
//         '/bucket',
//         '/about',
//         '/account/:path*',
//     ],
// };


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

            // Теперь проверяем роль по role_id
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
            // const userRoleId = '676823d21e6062779cfd474e';  // ID роли пользователя (если нужно)

            if (roleId === adminRoleId) {
                console.log("Role is admin, checking page access");
                // Администратору доступны только страницы /admin/:path*
                if (!url.pathname.startsWith('/admin')) {
                    console.log("Admin tried to access a non-admin page, redirecting to /admin");
                    return NextResponse.redirect(new URL('/admin/users', req.url));
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

