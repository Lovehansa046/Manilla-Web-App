import {NextResponse} from 'next/server';

export async function POST() {
    // Удаление токена из cookies
    const response = NextResponse.json({message: 'Logout successful'});
    response.cookies.set('token', '', {
        httpOnly: true,
        path: '/',
        maxAge: 0,
    });

    return response;
}
