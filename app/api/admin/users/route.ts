// /backend/api/users/route.ts
import {getConnection} from "@/backend/dbConnection/dbConnection";
import {NextResponse} from "next/server";


/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to users
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a list of users
 *     responses:
 *       200:
 *         description: A list of users
 */

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
