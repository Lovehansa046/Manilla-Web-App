import React from "react";
import Image from "next/image";

interface CartItemProps {
    item: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        imageUrl: string;
    };
    onRemove: (id: string) => void; // Тип для функции удаления
    onUpdateQuantity: (id: string, quantity: number) => void; // Тип для функции обновления количества
}

const CartItem: React.FC<CartItemProps> = ({item, onRemove, onUpdateQuantity}) => {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b border-gray-200">
            <Image
                src={item.imageUrl}
                alt={item.name}
                width={36} height={36}
                className="w-36 h-36 object-cover rounded-lg"
            />
            <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">Цена: {item.price} €</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                >
                    -
                </button>
                <span className="text-lg font-medium">{item.quantity}</span>
                <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                    +
                </button>
            </div>
            <button
                className="mt-4 sm:mt-0 sm:ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => onRemove(item.id)}
            >
                Удалить
            </button>
        </div>
    );
};

export default CartItem;
