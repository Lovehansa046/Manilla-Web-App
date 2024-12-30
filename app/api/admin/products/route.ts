// POST Handler
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Добавить новый продукт
 *     description: Добавить новый продукт в базу данных
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - product_type_id
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название продукта
 *               description:
 *                 type: string
 *                 description: Описание продукта
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Цена продукта
 *               image:
 *                 type: string
 *                 description: Ссылка на изображение продукта
 *               product_type_id:
 *                 type: integer
 *                 description: Тип продукта
 *               is_alcoholic:
 *                 type: boolean
 *                 description: Признак алкоголя
 *               quantity_available:
 *                 type: integer
 *                 description: Количество доступных единиц
 *     responses:
 *       201:
 *         description: Продукт успешно создан
 *       400:
 *         description: Не указано имя, цена или тип продукта
 *       500:
 *         description: Ошибка при добавлении продукта
 */
import {NextResponse} from 'next/server';
import {ObjectId} from "mongodb";
import {getConnection} from '@/backend/dbConnection/dbConnection'; // Проверьте правильность импорта `getConnection`

interface Product {
    name: string;
    description?: string | null;
    price: number;
    image?: string | null;
    product_type_id: number;
    is_alcoholic?: boolean;
    quantity_available?: number;
}

//
// interface Product {
//     name: string;
//     description?: string;
//     price: number;
//     image?: string;
//     product_type_id: string;
//     is_alcoholic?: boolean;
//     quantity_available?: number;
// }

async function createProduct(req: Request) {
    try {
        const {
            name,
            description,
            price,
            image,
            product_type_id,
            is_alcoholic,
            quantity_available,
        }: Partial<Product> = await req.json();

        // Проверка на обязательные поля
        if (!name || !price || !product_type_id) {
            return NextResponse.json(
                {message: "Необходимо указать имя, цену и тип продукта"},
                {status: 400}
            );
        }

        // Дополнительная валидация
        if (price <= 0) {
            return NextResponse.json(
                {message: "Цена должна быть положительным числом"},
                {status: 400}
            );
        }


        // Установите значение `is_alcoholic` по умолчанию
        const alcoholic = is_alcoholic ?? false;
        const quantity = quantity_available ?? 0;

        const {db} = await getConnection();

        const product = {
            name,
            description: description || null,
            price,
            image: image || null,
            product_type_id: new ObjectId(product_type_id),
            is_alcoholic: alcoholic,
            quantity_available: quantity,
        };

        const result = await db.collection('Product').insertOne(product);

        return NextResponse.json(
            {message: "Продукт успешно создан", productId: result.insertedId.toString()},
            {status: 201}
        );
    } catch (error) {
        console.error("Ошибка при добавлении продукта:", error);
        return NextResponse.json(
            {message: "Ошибка при добавлении продукта", error: String(error)},
            {status: 500}
        );
    }
}

export async function POST(req: Request) {
    return createProduct(req);
}


// export async function GET(req: Request) {
//     return getProducts(req);
// }

// GET Handler
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех продуктов или отфильтрованных по типу
 *     description: Получить список всех продуктов или отфильтрованных по типу
 *     parameters:
 *       - in: query
 *         name: type_product
 *         required: false
 *         schema:
 *           type: string
 *           description: Тип продукта для фильтрации
 *     responses:
 *       200:
 *         description: Список продуктов
 *       500:
 *         description: Ошибка при получении данных
 */
async function getProducts(req: Request) {
    const url = new URL(req.url);
    const type_product = url.searchParams.get("type_product");  // Получаем параметр из URL

    try {
        const {db} = await getConnection();

        // Если type_product передан, конвертируем его в ObjectId для фильтрации
        const query = type_product
            ? {product_type_id: new ObjectId(type_product)}  // Преобразуем строку в ObjectId
            : {};  // Если type_product не передан, получаем все продукты

        // Получаем список продуктов, соответствующих фильтру
        const products = await db.collection("Product").find(query).toArray();

        return NextResponse.json({products});
    } catch (error) {
        console.error("Ошибка при получении продуктов:", error);
        return NextResponse.json(
            {message: "Ошибка при получении данных", error: String(error)},
            {status: 500}
        );
    }
}

export async function GET(req: Request) {
    return getProducts(req);
}