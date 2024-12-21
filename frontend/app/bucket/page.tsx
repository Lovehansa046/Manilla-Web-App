'use client'

import React, {useState, useEffect} from 'react';
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState({
        date: "",
        time: "",
    });

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        if (savedCart) {
            setCart(savedCart);
        }
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    const handleQuantityChange = (id, quantity) => {
        const updatedCart = cart.map(item =>
            item._id === id ? {...item, quantity} : item
        );
        setCart(updatedCart);
    };

    const handleRemoveItem = (id) => {
        const updatedCart = cart.filter(item => item._id !== id);
        setCart(updatedCart);
        if (updatedCart.length === 0) {
            localStorage.removeItem('cart');
        }
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Date Picker Logic
    const handleOpenDatePicker = () => {
        setShowDatePicker(true);
    };

    const handleCloseDatePicker = () => {
        setShowDatePicker(false);
    };

    const handleDateTimeChange = (e) => {
        const {name, value} = e.target;
        setSelectedDateTime((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveDateTime = async () => {
        const orderData = {
            user_id: '6766c10d6e2a8f4db12de570', // Замените на реальный ID пользователя
            predicted_date: selectedDateTime.date,
            predicted_time: selectedDateTime.time,
            products: cart.map(item => ({
                product_id: item._id, // Или другой идентификатор продукта
                quantity: item.quantity,
            })),
            status: "pending", // Статус заказа по умолчанию
        };

        try {
            const response = await fetch('/api/save_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();
            if (response.status === 201) {
                alert(`Заказ успешно создан! ID: ${data.orderId}`);
                setCart([]); // Очищаем корзину после отправки заказа
            } else {
                alert(`Ошибка: ${data.message}`);
            }
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            alert('Ошибка при отправке заказа');
        }
    };

    const getMinTime = () => {
        const now = new Date();
        return now.toISOString().split("T")[1].substring(0, 5); // Get current time in HH:mm format
    };

    return (
        <>
            <Navbar/>
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">Корзина</h1>
                {cart.length === 0 ? (
                    <div className="text-center text-gray-500">Ваша корзина пуста</div>
                ) : (
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={item._id}
                                 className="flex items-center justify-between bg-white shadow-lg rounded-lg p-4">
                                <img src='https://picsum.photos/id/237/200/300' alt={item.name}
                                     className="w-20 h-20 object-cover rounded-lg"/>
                                <div className="flex-1 ml-4">
                                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                    <p className="text-lg font-bold text-gray-900">{item.price} €</p>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                        disabled={item.quantity === 1}
                                        className="px-4 py-2 bg-gray-300 text-black rounded-lg disabled:opacity-50"
                                    >
                                        -
                                    </button>
                                    <span className="mx-4">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                        className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item._id)}
                                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span className="text-lg sm:text-xl font-semibold">Общая сумма:</span>
                    <span className="text-xl sm:text-2xl font-bold">{totalPrice} €</span>
                </div>
                {cart.length > 0 && (
                    <div className="mt-6 p-4 rounded-lg flex justify-center">
                        <button
                            className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600"
                            onClick={handleOpenDatePicker}
                        >
                            Оформить заказ
                        </button>
                    </div>
                )}
            </div>

            {/* Date Picker Modal */}
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
};

export default Cart;
