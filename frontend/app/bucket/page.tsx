"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import React, {useState} from "react";
import CartItem from "./CartItem";

export default function Bucket() {
    const [cartItems, setCartItems] = useState([
        {id: 1, name: "Товар 1", price: 500, quantity: 1, image: "/image/crop__2_2.jpg"},
        {id: 2, name: "Товар 2", price: 1200, quantity: 2, image: "/image/crop__2_2.jpg"},
    ]);

    const handleRemove = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleUpdateQuantity = (id, newQuantity) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? {...item, quantity: newQuantity} : item
        ));
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>
            <Navbar/>
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">Корзина</h1>
                <div className="space-y-4">
                    {cartItems.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onRemove={handleRemove}
                            onUpdateQuantity={handleUpdateQuantity}
                        />
                    ))}
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between items-center">
                    <span className="text-lg sm:text-xl font-semibold">Общая сумма:</span>
                    <span className="text-xl sm:text-2xl font-bold">{totalPrice} ₽</span>
                </div>
                <div className="mt-6 p-4 rounded-lg flex flex-col sm:flex-row justify-center items-center">
                    <button
                        className=" mt-6 sm:mt-0 sm:ml-10 bg-red-500 text-white px-32 py-4 rounded-lg hover:bg-red-600">
                        Заказать!
                    </button>
                </div>
            </div>
            <Footer/>
        </>
    );
}
