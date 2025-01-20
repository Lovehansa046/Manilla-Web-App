import {NextRequest, NextResponse} from "next/server";
import {getConnection} from "@/backend/dbConnection/dbConnection"; // Подключение к базе данных
import {ObjectId} from 'mongodb'; // Импортируем ObjectId из MongoDB

export async function PATCH(req: NextRequest, {params}: { params: { orderId: string } }) {
    try {
        const {orderId} = params; // Получаем orderId из параметров URL

        if (!orderId) {
            return NextResponse.json(
                {message: "Order ID is required."},
                {status: 400}
            );
        }

        const {db, client} = await getConnection();

        // Находим заказ по ID
        const order = await db.collection("orders").findOne({_id: new ObjectId(orderId)});

        if (!order) {
            return NextResponse.json(
                {message: "Order not found."},
                {status: 404}
            );
        }

        // Обновляем статус заказа на 'completed'
        const result = await db
            .collection("orders")
            .updateOne(
                {_id: new ObjectId(orderId)},
                {$set: {status: "completed"}}
            );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                {message: "Status update failed."},
                {status: 500}
            );
        }

        await client.close(); // Закрываем подключение к базе данных

        // Возвращаем успешный ответ
        return NextResponse.json(
            {message: "Order status updated to 'completed'."},
            {status: 200}
        );
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json(
            {message: "Error updating order status", error: String(error)},
            {status: 500}
        );
    }
}
