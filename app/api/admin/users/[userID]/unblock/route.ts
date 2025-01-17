import {NextResponse} from 'next/server';
import {getConnection} from '@/backend/dbConnection/dbConnection';
import {ObjectId} from 'mongodb';

export async function PUT(request: Request) {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/'); // Разбиваем путь на части
    const userID = pathSegments[pathSegments.length - 2]; // Получаем предпоследний элемент    console.log('Получен userID:', userID);

    if (!userID || !ObjectId.isValid(userID)) {
        return NextResponse.json({message: 'Некорректный ID пользователя'}, {status: 400});
    }

    try {
        const {db} = await getConnection();
        const objectId = new ObjectId(userID);

        // Проверяем, существует ли пользователь
        const user = await db.collection('User').findOne({_id: objectId});
        if (!user) {
            return NextResponse.json({message: 'Пользователь не найден'}, {status: 404});
        }

        // Обновляем статус пользователя на разблокирован
        const result = await db.collection('User').updateOne(
            {_id: objectId},
            {$set: {isBlocked: false}}
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({message: 'Не удалось обновить статус пользователя'}, {status: 500});
        }

        return NextResponse.json({message: 'Пользователь успешно разблокирован'});
    } catch (error) {
        console.error('Ошибка при разблокировке пользователя:', error);
        return NextResponse.json({message: 'Ошибка сервера'}, {status: 500});
    }
}


/**
 * @swagger
 * /api/admin/users/{id}/unblock:
 *   put:
 *     tags:
 *       - Users
 *     description: UnBlocks a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to unblock
 *     responses:
 *       200:
 *         description: User successfully unblocked
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */