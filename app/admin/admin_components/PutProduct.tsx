import React, {useEffect, useState} from "react";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    productTypeId: string;
    quantity_available: number;
    is_alcoholic: boolean;
}

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedProduct: Product) => void;
    productData: Product;
}

export default function EditProductModal({
                                             isOpen,
                                             onClose,
                                             onSave,
                                             productData,
                                         }: EditProductModalProps) {
    const [product, setProduct] = useState<Product>(productData);

    useEffect(() => {
        setProduct(productData);
    }, [productData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type} = e.target;
        const newValue = type === "number" ? parseFloat(value) : value;

        setProduct(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSave = () => {
        onSave(product);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Modal Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Редактировать продукт</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Название</label>
                            <input
                                type="text"
                                name="name"
                                value={product.name || ""}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Описание</label>
                            <input
                                type="text"
                                name="description"
                                value={product.description || ""}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Цена</label>
                            <input
                                type="number"
                                name="price"
                                value={product.price || 0}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Изображение</label>
                            <input
                                type="text"
                                name="image"
                                value={product.image || ""}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Количество</label>
                            <input
                                type="number"
                                name="quantity_available"
                                value={product.quantity_available || 0}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Алкогольный</label>
                            <input
                                type="checkbox"
                                name="isAlcoholic"
                                checked={product.is_alcoholic}
                                onChange={e =>
                                    setProduct(prev => ({
                                        ...prev,
                                        isAlcoholic: e.target.checked,
                                    }))
                                }
                                className="h-5 w-5 text-blue-500"
                            />
                        </div>
                    </div>

                    {/* Modal Buttons */}
                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Сохранить
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
