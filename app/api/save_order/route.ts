import {NextRequest, NextResponse} from "next/server";
import {getConnection} from "@/backend/dbConnection/dbConnection";
import jwt, {JwtPayload} from "jsonwebtoken";
import {ObjectId} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET не задан в переменных окружения");

interface Product {
    product_id: ObjectId;
    quantity: number;
}

interface OrderRequest {
    predicted_date: string;
    predicted_time: string;
    price_bucket: number;
    products: Product[];
    status: "pending" | "completed" | "cancelled";
}

export async function POST(req: NextRequest) {
    try {
        const {predicted_date, predicted_time, price_bucket, products, status}: OrderRequest = await req.json();
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({message: "Токен отсутствует"}, {status: 401});
        }

        if (!JWT_SECRET) throw new Error("JWT_SECRET не задан в переменных окружения");

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const userId = decoded.userId;

        if (!predicted_date || !predicted_time || !Array.isArray(products) || products.length === 0 || !price_bucket) {
            return NextResponse.json({message: "Некорректные данные"}, {status: 400});
        }

        const {db, client} = await getConnection();
        const user = await db.collection("User").findOne({_id: new ObjectId(userId)});

        if (!user) {
            await client.close();
            return NextResponse.json({message: "Пользователь не найден"}, {status: 401});
        }

        const result = await db.collection("orders").insertOne({
            user_id: new ObjectId(userId),
            predicted_date,
            predicted_time,
            price_bucket,
            products: products.map(product => ({
                product_id: new ObjectId(product.product_id), // Преобразуем в ObjectId
                quantity: product.quantity,
            })),
            status: status || "pending",
            created_at: new Date(),
        });

        await client.close();
        return NextResponse.json({
            message: "Заказ успешно создан",
            orderId: result.insertedId.toString()
        }, {status: 201});

    } catch (error) {
        console.error("Ошибка при добавлении заказа:", error);
        return NextResponse.json({message: "Ошибка при добавлении заказа", error: String(error)}, {status: 500});
    }
}

export async function GET(req: NextRequest) {
    try {
        const {db, client} = await getConnection();
        const orders = await db.collection("orders").find().toArray();
        await client.close();
        return NextResponse.json({orders});
    } catch (error) {
        console.error("Ошибка при получении заказов:", error);
        return NextResponse.json({message: "Ошибка при получении заказов", error: String(error)}, {status: 500});
    }
}
