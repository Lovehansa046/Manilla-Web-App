"use client"

import React from "react";

interface Product {
    _id: string;
    name: string;
    image: string;
}

interface ProductGridAdminProps {
    products: Product[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function ProductGridAdmin({products, onEdit, onDelete}: ProductGridAdminProps) {
    return (
        <div className="w-full p-4 space-y-4">
            {products.length === 0 ? (
                <div className="text-center text-xl font-semibold text-gray-500">
                    Продукты скоро появятся или нужно добавить продукты в эту категорию.
                </div>
            ) : (
                products.map((product) => (
                    <div
                        key={product._id}
                        className="flex items-center justify-between border border-gray-300 rounded-xl p-4 hover:shadow-md transition"
                    >
                        <div className="flex items-center space-x-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <span className="text-lg font-semibold">{product.name}</span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => onEdit(product._id)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={() => onDelete(product._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
