import {NextResponse} from 'next/server';
import {getConnection} from "@/backend/dbConnection/dbConnection";
import {ObjectId} from "mongodb";

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

    // Дополнительная валидация
    if (typeof price !== 'number' || price <= 0) {
        return NextResponse.json({message: "Цена должна быть положительным числом"}, {status: 400});
    }

    if (typeof product_type_id !== 'number' || product_type_id <= 0) {
        return NextResponse.json({message: "Некорректный тип продукта"}, {status: 400});
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
 *       - in: query
 *         name: price_min
 *         required: false
 *         schema:
 *           type: number
 *           format: float
 *           description: Минимальная цена для фильтрации
 *       - in: query
 *         name: price_max
 *         required: false
 *         schema:
 *           type: number
 *           format: float
 *           description: Максимальная цена для фильтрации
 *       - in: query
 *         name: is_alcoholic
 *         required: false
 *         schema:
 *           type: boolean
 *           description: Фильтрация по наличию алкоголя
 *     responses:
 *       200:
 *         description: Список продуктов
 *       500:
 *         description: Ошибка при получении данных
 */
// async function getProducts(req: Request) {
//     const url = new URL(req.url);
//     const type_product = url.searchParams.get('type_product');
//     const price_min = parseFloat(url.searchParams.get('price_min') || '0');
//     const price_max = parseFloat(url.searchParams.get('price_max') || 'Infinity');
//     const is_alcoholic = url.searchParams.get('is_alcoholic');
//
//     try {
//         const {db} = await getConnection();
//
//         // Создаем условия фильтрации
// // Типизация запроса для фильтрации продуктов
//         const query: {
//             product_type_id?: number;
//             price?: { $gte?: number; $lte?: number };
//             is_alcoholic?: boolean;
//         } = {};
//
//         if (type_product) {
//             query.product_type_id = parseInt(type_product);
//         }
//
//         if (!isNaN(price_min)) {
//             query.price = {$gte: price_min};
//         }
//
//         if (!isNaN(price_max)) {
//             query.price = {...query.price, $lte: price_max};
//         }
//
//         if (is_alcoholic !== null) {
//             query.is_alcoholic = is_alcoholic === 'true';
//         }
//
//         // Получаем список продуктов, соответствующих фильтру
//         const products = await db.collection('Product').find(query).toArray();
//
//         return NextResponse.json({products});
//     } catch (error) {
//         console.error("Ошибка при получении продуктов:", error);
//         return NextResponse.json({message: "Ошибка при получении данных", error: String(error)}, {status: 500});
//     }
// }

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