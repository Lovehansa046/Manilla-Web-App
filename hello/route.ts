/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */
export async function GET(request: Request) {
    // Пример использования request для доступа к заголовкам
    const userAgent = request.headers.get('User-Agent');

    // Возвращаем ответ с добавлением User-Agent
    return new Response(`Hello World! Your user agent is: ${userAgent}`, {
        status: 200,
    });
}
