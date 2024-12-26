import {getConnection} from "../../../dbConnection/dbConnection";
// import {authenticateAdmin} from "../../middleware/authMiddleware";
//
async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const {db, client} = await getConnection();

            const users = await db.collection("User").find().toArray();

            await client.close();

            return res.status(200).json({users});
        } catch (error) {
            console.error("Ошибка при получении пользователей:", error);
            return res.status(500).json({message: "Ошибка при получении пользователей"});
        }
    } else {
        return res.status(405).json({message: "Метод не поддерживается"});
    }
}

export default authenticateAdmin(handler);
