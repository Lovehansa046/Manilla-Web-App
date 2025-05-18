import {NextRequest, NextResponse} from "next/server";
import {getConnection} from "@/backend/dbConnection/dbConnection";
import {ObjectId} from "mongodb";

// Интерфейс для параметров маршрута (параметр id)


// Интерфейс для контекста, который содержит params


// interface ProductData {
//     _id?: string;  // добавляем _id как необязательное свойство
//     name: string;
//     description: string;
//     price: number;
//     image: string;
//     productTypeId: string;
//     quantityAvailable: number;
//     isAlcoholic: boolean;
// }


// Функция для обновления продукта
export async function PUT(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const product_id = searchParams.get("product_id");

    if (!product_id) {
        return NextResponse.json({error: "product_id is required"}, {status: 400});
    }

    try {
        const {db} = await getConnection();
        const productData = await req.json();

        const existingProduct = await db.collection("Product").findOne({_id: new ObjectId(product_id)});

        if (!existingProduct) {
            return NextResponse.json({error: "Product not found"}, {status: 404});
        }

        const {_id, quantityAvailable, ...rawUpdateData} = productData;

        const updateData = {
            ...rawUpdateData,
            price: typeof rawUpdateData.price === "string" ? parseFloat(rawUpdateData.price) : rawUpdateData.price,
            quantity_available: typeof rawUpdateData.quantity_available === "string"
                ? parseInt(rawUpdateData.quantity_available)
                : rawUpdateData.quantity_available,
            product_type_id: new ObjectId(rawUpdateData.product_type_id),
        };

        await db.collection("Product").updateOne(
            {_id: new ObjectId(product_id)},
            {$set: updateData}
        );

        return NextResponse.json({message: "Product updated successfully"}, {status: 200});
    } catch (error) {
        console.error("Ошибка при обновлении продукта:", error);
        return NextResponse.json({error: "Failed to update product"}, {status: 500});
    }
}

// Функция для удаления продукта
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");

    if (!product_id) {
        return NextResponse.json({ error: "product_id is required" }, { status: 400 });
    }

    try {
        const { db } = await getConnection();
        const result = await db.collection("Product").deleteOne({ _id: new ObjectId(product_id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Ошибка при удалении продукта:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
