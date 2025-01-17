/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Возвращает приветственное сообщение
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello, world!
 */
export default function handler(req, res) {
    res.status(200).json({message: 'Hello, world!'});
}
