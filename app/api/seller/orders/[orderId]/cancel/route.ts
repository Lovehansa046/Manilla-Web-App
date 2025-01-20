import {NextRequest, NextResponse} from 'next/server';
import {getConnection} from '@/backend/dbConnection/dbConnection'; // Подключение к базе данных
import {ObjectId} from 'mongodb';

export async function PATCH(request: NextRequest) {
    try {
        // Извлекаем orderId из URL (предполагается, что URL имеет формат /api/seller/orders/{orderId}/cancel)
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/'); // Разбиваем путь на части
        const orderId = pathSegments[pathSegments.length - 2]; // Извлекаем orderId как предпоследний сегмент

        console.log("Received request to cancel order with ID:", orderId);

        // Проверка валидности orderId как ObjectId
        if (!ObjectId.isValid(orderId)) {
            console.log("Invalid orderId:", orderId);
            return NextResponse.json({message: "Invalid orderId"}, {status: 400});
        }

        const {db, client} = await getConnection();
        console.log("Connected to the database");

        // Ищем заказ по ID
        const order = await db.collection('orders').findOne({_id: new ObjectId(orderId)});
        console.log("Order found:", order);

        if (!order) {
            console.error("Order not found for ID:", orderId);
            return NextResponse.json({message: "Order not found"}, {status: 404});
        }

        // Изменяем статус заказа
        const updatedOrder = await db.collection('orders').updateOne(
            {_id: new ObjectId(orderId)},
            {$set: {status: 'cancelled'}}
        );

        console.log("Update result:", updatedOrder);

        if (updatedOrder.modifiedCount === 0) {
            console.error("Failed to cancel order with ID:", orderId);
            return NextResponse.json({message: "Failed to cancel order"}, {status: 500});
        }

        await client.close(); // Закрываем соединение
        console.log("Connection closed");

        return NextResponse.json({message: "Order cancelled successfully"});
    } catch (error) {
        console.error("Error cancelling order:", error);
        return NextResponse.json({message: "Internal server error", error: String(error)}, {status: 500});
    }
}
