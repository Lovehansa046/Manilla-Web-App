import {NextResponse} from 'next/server';
import {getConnection} from "@/backend/dbConnection/dbConnection";

interface Product {
    name: string;
    description?: string | null;
    price: number;
    image?: string | null;
    product_type_id: number;
    is_alcoholic?: boolean;
    quantity_available?: number;
}

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
async function createProduct(req: Request) {
    const {
        name,
        description,
        price,
        image,
        product_type_id,
        is_alcoholic,
        quantity_available
    }: Product = await req.json();

    // Проверка на наличие обязательных полей
    if (!name || !price || !product_type_id) {
        return NextResponse.json({message: "Необходимо указать имя, цену и тип продукта"}, {status: 400});
    }

    try {
        const {db} = await getConnection();

        // Добавляем новый продукт в коллекцию 'Product'
        const product = {
            name,
            description: description || null,
            price,
            image: image || null,
            product_type_id,
            is_alcoholic: is_alcoholic || false,
            quantity_available: quantity_available || 0,
        };

        const result = await db.collection('Product').insertOne(product);

        return NextResponse.json({message: "Продукт успешно создан", productId: result.insertedId}, {status: 201});
    } catch (error) {
        console.error("Ошибка при добавлении продукта:", error);
        return NextResponse.json({message: "Ошибка при добавлении продукта", error: String(error)}, {status: 500});
    }
}

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
    const type_product = url.searchParams.get('type_product');

    try {
        const {db} = await getConnection();

        // Если type_product не передан, используем пустой запрос для получения всех продуктов
        const query = type_product ? {product_type_id: parseInt(type_product)} : {};

        // Получаем список продуктов, соответствующих фильтру
        const products = await db.collection('Product').find(query).toArray();

        return NextResponse.json({products});
    } catch (error) {
        console.error("Ошибка при получении продуктов:", error);
        return NextResponse.json({message: "Ошибка при получении данных", error: String(error)}, {status: 500});
    }
}

export async function POST(req: Request) {
    return createProduct(req);
}

export async function GET(req: Request) {
    return getProducts(req);
}
