import {NextResponse} from 'next/server';

export async function roleMiddleware(req) {
    const token = req.cookies.get('token')?.value; // Получаем токен из cookies
    const url = req.nextUrl.clone();

    if (!token) {
        console.log("Token not found in cookies");
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        // Отправляем запрос к API для проверки роли
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

        return NextResponse.next(); // Всё в порядке, продолжаем
    } catch (error) {
        console.error("Error checking role:", error);
        return NextResponse.redirect(new URL('/login', req.url));
    }
}
