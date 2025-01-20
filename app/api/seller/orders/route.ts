import {NextRequest, NextResponse} from "next/server";
import {getConnection} from "@/backend/dbConnection/dbConnection"; // Подключение к базе данных
import {ObjectId} from 'mongodb'; // Импортируем ObjectId из MongoDB

interface Product {
    product_id: string;
    quantity: number;
    // Дополнительные свойства, если они есть
}

interface User {
    first_name: string;
    last_name: string;
    email: string
}

export async function GET(req: NextRequest) {
    try {
        const {db, client} = await getConnection();

        // Получение всех заказов
        const ordersCollection = db.collection("orders");
        const orders = await ordersCollection.find().toArray();


        // Получаем детали продуктов для каждого заказа
        const ordersWithProductDetails = await Promise.all(
            orders.map(async (order) => {

                const user = await db.collection("User").findOne({_id: new ObjectId(order.user_id)});


                const productsWithDetails = await Promise.all(
                    order.products.map(async (product: Product) => {  // Явная типизация для product
                        const productDetails = await db
                            .collection('Product') // Коллекция продуктов
                            .findOne({_id: new ObjectId(product.product_id)});

                        return {
                            ...product, // Добавляем данные из order.products
                            productDetails: productDetails || {name: 'Неизвестный продукт', price: 0}, // Заполняем пустые данные
                        };
                    })
                );

                return {
                    ...order,
                    user: user ?
                        {first_name: user.FirstName, last_name: user.LastName, email: user.Email}
                        : {
                            first_name: 'Неизвестно',
                            last_name: 'Неизвестно',
                            email: 'example@example.com'
                        },

                    products: productsWithDetails
                }; // Возвращаем заказ с добавленными данными продуктов

            })
        );


        await client.close(); // Закрываем подключение к базе данных

        return NextResponse.json({orders: ordersWithProductDetails}); // Отправляем данные обратно на фронт
    } catch (error) {
        console.error("Ошибка при получении заказов:", error);
        return NextResponse.json({
            message: "Ошибка при получении заказов",
            error: String(error),
        }, {status: 500});
    }
}
