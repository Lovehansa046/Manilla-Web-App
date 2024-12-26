/**
 * @swagger
 * /api/role:
 *   post:
 *     summary: Создание новой роли
 *     description: Этот метод создает новую роль с указанным именем и описанием.
 *     requestBody:
 *       description: Данные роли, которые нужно создать
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleName
 *               - roleDescription
 *             properties:
 *               roleName:
 *                 type: string
 *                 description: Название роли
 *               roleDescription:
 *                 type: string
 *                 description: Описание роли
 *     responses:
 *       201:
 *         description: Роль успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Роль успешно создана
 *                 role:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64b0f7f33b1d07e8e174d1a2"
 *                     roleName:
 *                       type: string
 *                       example: "admin"
 *                     roleDescription:
 *                       type: string
 *                       example: "Администратор с полными правами"
 *       400:
 *         description: Ошибка в запросе
 *       409:
 *         description: Роль с таким именем уже существует
 *       500:
 *         description: Ошибка сервера
 */
import {getConnection} from '../../dbConnection/dbConnection';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Метод не разрешен'});
    }

    const {roleName, roleDescription} = req.body;

    if (!roleName || !roleDescription) {
        return res.status(400).json({message: 'Все поля обязательны'});
    }

    try {
        const {db, client} = await getConnection(); // Получаем доступ и к клиенту, и к базе данных

        const existingRole = await db.collection('Role').findOne({roleName});
        if (existingRole) {
            return res.status(409).json({message: 'Роль с таким именем уже существует'});
        }

        const result = await db.collection('Role').insertOne({
            roleName,
            roleDescription,
            createdAt: new Date(),
        });

        // Закрываем соединение после выполнения операции
        await client.close();

        res.status(201).json({
            message: 'Роль успешно создана',
            role: {id: result.insertedId, roleName, roleDescription},
        });
    } catch (error) {
        console.error('Ошибка при создании роли:', error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
}
