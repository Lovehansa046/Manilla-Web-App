// app/api/seller/orders/[orderId]/cancel/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {getConnection} from '@/backend/dbConnection/dbConnection'; // Подключение к базе данных
import {ObjectId} from 'mongodb';

export async function PATCH(request: NextRequest, {params}: { params: { orderId: string } }) {
    try {
        console.log("Received request to cancel order with ID:", params.orderId);

        // Асинхронно извлекаем orderId
        const {orderId} = params;

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

        await client.close();  // Закрываем соединение
        console.log("Connection closed");

        return NextResponse.json({message: "Order cancelled successfully"});
    } catch (error) {
        console.error("Error cancelling order:", error);
        return NextResponse.json({message: "Internal server error", error: String(error)}, {status: 500});
    }
}
