"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import React, {useEffect, useState} from "react";
import CartItem from "./CartItem";

export default function Bucket() {
    // Состояние для корзины
    const [cartItems, setCartItems] = useState([]);

    // Состояние для выбора даты и времени
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState({date: "", time: ""});

    // Загружаем данные о товарах из localStorage
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart"));
        if (savedCart) {
            setCartItems(savedCart);
        }
    }, []);

    // Функция для обновления корзины в localStorage
    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cartItems));  // Сохраняем корзину в localStorage
        }
    }, [cartItems]);

    const handleRemove = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;  // Проверка, чтобы количество было больше 0
        setCartItems(cartItems.map((item) =>
            item.id === id ? {...item, quantity: newQuantity} : item
        ));
    };

    const handleOrderClick = () => {
        setShowDatePicker(true);
    };

    const handleDateTimeChange = (e) => {
        const {name, value} = e.target;
        setSelectedDateTime((prev) => ({...prev, [name]: value}));
    };

    const handleCloseDatePicker = () => {
        setShowDatePicker(false); // Закрыть окно выбора даты и времени
    };


    const handleSaveDateTime = async () => {
        const currentDateTime = new Date();
        const selectedDateTimeValue = new Date(`${selectedDateTime.date}T${selectedDateTime.time}`);

        if (selectedDateTime.date === currentDateTime.toISOString().split("T")[0]) {
            const minTime = new Date(currentDateTime.getTime() + 30 * 60000); // Текущее время + 30 минут
            const selectedTime = new Date(`${selectedDateTime.date}T${selectedDateTime.time}`);
            if (selectedTime < minTime) {
                alert("Время должно быть как минимум через 30 минут!");
                return;
            }
        } else if (selectedDateTimeValue < currentDateTime) {
            alert("Вы не можете выбрать прошлую дату или время!");
            return;
        }

        // Подготовка данных для отправки
        const order = {
            user_id: 1, // Здесь можно взять текущий user_id
            predicted_date: selectedDateTime.date,
            predicted_time: selectedDateTime.time,
            products: await fetchProductsDetails(cartItems), // Получаем подробную информацию о товарах
            status: "pending",
        };

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(order),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Заказ успешно оформлен! ID заказа: ${result.orderId}`);
                setCartItems([]);  // Очистить корзину
            } else {
                const error = await response.json();
                alert(`Ошибка при оформлении заказа: ${error.message}`);
            }
        } catch (error) {
            console.error("Ошибка при отправке заказа:", error);
            alert("Произошла ошибка при отправке заказа.");
        }

        setShowDatePicker(false);
    };

    // Функция для получения подробной информации о товарах из корзины
    const fetchProductsDetails = async (cartItems) => {
        const productIds = cartItems.map(item => item.id);
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({productIds})
            });
            const data = await response.json();
            // Объединяем детали продуктов с количеством из корзины
            return data.products.map(product => {
                const cartItem = cartItems.find(item => item.id === product.id);
                return {
                    ...product,
                    quantity: cartItem.quantity
                };
            });
        } catch (error) {
            console.error("Ошибка при получении информации о товарах:", error);
            return [];
        }
    };

    const getMinTime = () => {
        const currentDateTime = new Date();
        const minTime = new Date(currentDateTime.getTime() + 30 * 60000); // Текущее время + 30 минут
        return currentDateTime.toISOString().split("T")[0] === selectedDateTime.date
            ? minTime.toISOString().split("T")[1].slice(0, 5)
            : "00:00";
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 1); // Учитываем quantity

    return (
        <>
            <Navbar/>
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">Корзина</h1>
                <div className="space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-gray-500">Ваша корзина пуста</div>
                    ) : (
                        cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onRemove={handleRemove}
                                onUpdateQuantity={handleUpdateQuantity}
                            />
                        ))
                    )}
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between items-center">
                    <span className="text-lg sm:text-xl font-semibold">Общая сумма:</span>
                    <span className="text-xl sm:text-2xl font-bold">{totalPrice} €</span>
                </div>
                <div className="mt-6 p-4 rounded-lg flex flex-col sm:flex-row justify-center items-center">
                    <button
                        className="mt-6 sm:mt-0 sm:ml-10 bg-red-500 text-white px-32 py-4 rounded-lg hover:bg-red-600"
                        onClick={handleOrderClick}
                    >
                        Заказать!
                    </button>
                </div>
            </div>
            {showDatePicker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4 text-center">Выберите дату и время</h2>
                        <input
                            type="date"
                            name="date"
                            value={selectedDateTime.date}
                            onChange={handleDateTimeChange}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full border p-2 rounded-lg mb-4"
                        />
                        <input
                            type="time"
                            name="time"
                            value={selectedDateTime.time}
                            onChange={handleDateTimeChange}
                            min={getMinTime()}
                            className="w-full border p-2 rounded-lg mb-4"
                        />
                        <div className="flex justify-between">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                onClick={handleSaveDateTime}
                            >
                                Сохранить
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                                onClick={handleCloseDatePicker}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer/>
        </>
    );
}
