import {NextResponse} from 'next/server';
import {ObjectId} from 'mongodb';
import {getConnection} from '@/backend/dbConnection/dbConnection';

interface Product {
    product_id: string;
    quantity: number;
}

export async function GET(request: Request) {
    // Извлекаем userID из URL
    const url = new URL(request.url);
    const userID = url.pathname.split('/').pop(); // Предполагается, что userID будет в конце URL

    if (!userID) {
        return NextResponse.json({message: 'ID пользователя не предоставлено'}, {status: 400});
    }

    if (!ObjectId.isValid(userID)) {
        return NextResponse.json({message: 'Некорректный ID пользователя'}, {status: 400});
    }

    try {
        const {db} = await getConnection();
        const objectId = new ObjectId(userID);

        const user = await db.collection('User').findOne({_id: objectId});
        if (!user) {
            return NextResponse.json({message: 'Пользователь не найден'}, {status: 404});
        }

        const orders = await db.collection('orders').find({user_id: objectId}).toArray();
        if (orders.length === 0) {
            return NextResponse.json({message: 'У пользователя нет заказов'}, {status: 404});
        }

        const ordersWithProductDetails = await Promise.all(
            orders.map(async (order) => {
                const productsWithDetails = await Promise.all(
                    order.products.map(async (product: Product) => {
                        const productDetails = await db
                            .collection('Product')
                            .findOne({_id: new ObjectId(product.product_id)});

                        return {
                            ...product,
                            productDetails: productDetails || {name: 'Неизвестный продукт', price: 0},
                        };
                    })
                );

                return {...order, products: productsWithDetails};
            })
        );

        return NextResponse.json({user, orders: ordersWithProductDetails});
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        return NextResponse.json({message: 'Ошибка сервера'}, {status: 500});
    }
}


/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     description: Blocks a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to block
 *     responses:
 *       200:
 *         description: User successfully blocked
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */




export async function PUT(request: Request) {

    const url = new URL(request.url);
    const userID = url.pathname.split('/').pop(); // Предполагается, что userID будет в конце URL
    console.log('Получен userID:', userID);

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

        // Обновляем статус пользователя
        const result = await db.collection('User').updateOne(
            {_id: objectId},
            {$set: {isBlocked: true}}
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({message: 'Не удалось обновить статус пользователя'}, {status: 500});
        }

        return NextResponse.json({message: 'Пользователь успешно заблокирован'});
    } catch (error) {
        console.error('Ошибка при блокировке пользователя:', error);
        return NextResponse.json({message: 'Ошибка сервера'}, {status: 500});
    }
}



/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a list of users
 *     responses:
 *       200:
 *         description: A list of users
 */