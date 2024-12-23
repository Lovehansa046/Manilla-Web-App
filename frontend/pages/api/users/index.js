import {getConnection} from "../../dbConnection/dbConnection"; // Подключаем getConnection
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {FirstName, LastName, Email, Password, image, roleName} = req.body;

        if (!FirstName || !LastName || !Email || !Password || !roleName) {
            return res.status(400).json({message: "Необходимо указать все обязательные поля"});
        }

        try {
            // Получаем подключение к базе данных MongoDB
            const {db, client} = await getConnection(); // Деструктурируем db и client

            // Проверяем, существует ли пользователь с таким email
            const existingUser = await db.collection("User").findOne({Email});

            if (existingUser) {
                return res.status(400).json({message: "Пользователь с таким email уже существует"});
            }

            // Хеширование пароля перед сохранением в базу данных
            const hashedPassword = await bcrypt.hash(Password, 10);

            // Проверяем, существует ли роль с таким названием
            const rolesCollection = db.collection("Role");
            let role = await rolesCollection.findOne({name: roleName});

            if (!role) {
                // Если роль не найдена, создаем ее
                role = await rolesCollection.insertOne({
                    name: roleName, // Пример: генерируем имя роли
                    createdAt: new Date()
                });
            }

            // Извлекаем role_id после того, как нашли или создали роль
            let role_id = role._id;

            // Добавление пользователя в коллекцию
            const result = await db.collection("User").insertOne({
                FirstName,
                LastName,
                Email,
                Password: hashedPassword,
                image,
                role_id, // Ссылаемся на роль в коллекции
            });

            // Закрываем подключение к базе данных
            await client.close();

            // Отправляем успешный ответ
            return res.status(201).json({message: "Пользователь успешно создан", userId: result.insertedId});
        } catch (error) {
            console.error("Ошибка при добавлении пользователя:", error);
            return res.status(500).json({message: "Ошибка при добавлении пользователя", error: error.message});
        }
    } else if (req.method === "GET") {
        try {
            // Получаем подключение к базе данных MongoDB
            const {db, client} = await getConnection(); // Деструктурируем db и client

            // Получаем коллекцию пользователей
            const usersCollection = db.collection("User");

            // Извлекаем всех пользователей
            const users = await usersCollection.find().toArray();

            if (users.length === 0) {
                return res.status(404).json({message: "Пользователи не найдены"});
            }

            // Закрываем подключение к базе данных
            await client.close();

            // Отправляем успешный ответ с массивом пользователей
            return res.status(200).json({message: "Пользователи успешно получены", users});
        } catch (error) {
            console.error("Ошибка при извлечении пользователей:", error);
            return res.status(500).json({message: "Ошибка при извлечении пользователей", error: error.message});
        }
    } else {
        res.status(405).json({message: "Метод не поддерживается"});
    }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     description: Добавить нового пользователя и роль
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               Email:
 *                 type: string
 *                 format: email
 *               Password:
 *                 type: string
 *               image:
 *                 type: string
 *                 description: URL изображения пользователя
 *               roleName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь и роль успешно созданы
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *                   description: Идентификатор созданного пользователя
 *       400:
 *         description: Не указаны обязательные поля или email уже существует
 *       500:
 *         description: Ошибка при добавлении пользователя и роли
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Получить всех пользователей
 *     responses:
 *       200:
 *         description: Пользователи успешно получены
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       FirstName:
 *                         type: string
 *                       LastName:
 *                         type: string
 *                       Email:
 *                         type: string
 *                       image:
 *                         type: string
 *                       role_id:
 *                         type: string
 *                       roleName:
 *                         type: string
 *       404:
 *         description: Пользователи не найдены
 *       500:
 *         description: Ошибка при извлечении пользователей
 */
