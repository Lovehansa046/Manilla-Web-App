import {NextResponse} from "next/server";
import {getConnection} from "@/backend/dbConnection/dbConnection";
import {ObjectId} from "mongodb";

export async function GET(request: Request) {
    // Извлекаем userID из пути URL
    const url = new URL(request.url);
    const userID = url.pathname.split('/').pop(); // Получаем userID из последнего сегмента пути

    if (!userID) {
        return NextResponse.json({message: "ID пользователя не предоставлен"}, {status: 400});
    }

    // Проверяем, является ли userID валидным ObjectId
    if (!ObjectId.isValid(userID)) {
        return NextResponse.json({message: "Некорректный ID пользователя"}, {status: 400});
    }

    try {
        // Получаем соединение с базой данных
        const {db} = await getConnection();
        const objectId = new ObjectId(userID); // Преобразуем userID в ObjectId для поиска в базе данных

        // Ищем пользователя в коллекции по его ID
        const user = await db.collection("User").findOne({_id: objectId});
        if (!user) {
            return NextResponse.json({message: "Пользователь не найден"}, {status: 404});
        }

        // Извлекаем данные пользователя
        const userInfo = {
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
        };

        return NextResponse.json(userInfo);
    } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
        return NextResponse.json({message: "Ошибка сервера"}, {status: 500});
    }
}
