// /backend/api/users/route.ts
import {getConnection} from "@/backend/dbConnection/dbConnection";
import {NextResponse} from "next/server";

// import {authenticateAdmin} from "../../middleware/authMiddleware";

export async function GET(req: Request) {
    // Прекращаем выполнение, если авторизация не прошла

    try {
        const {db, client} = await getConnection();
        const users = await db.collection("User").find().toArray();
        await client.close();

        return NextResponse.json({users}, {status: 200});
    } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
        return NextResponse.json({message: "Ошибка при получении пользователей"}, {status: 500});
    }
}
