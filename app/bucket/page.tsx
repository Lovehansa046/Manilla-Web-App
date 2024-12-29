'use client'

import React, {ChangeEvent, useEffect, useState} from 'react';
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {PayPalButtons} from "@paypal/react-paypal-js";

interface CartItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

const Cart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState({
        date: "",
        time: "",
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [, setPaymentSuccess] = useState(false); // Состояние для отслеживания успешности платежа
    const [, setUser] = useState(null);
    const [, setLoading] = useState(true);
    const [, setError] = useState<string>('');
    const [showPaymentModal, setShowPaymentModal] = useState(false); // Состояние для отображения модального окна оплаты

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userId = localStorage.getItem('user_id_token');

            if (!userId) {
                setError('Пользователь не авторизован');
                setLoading(false);
                return;
            }

            const fetchUserData = async () => {
                try {
                    const response = await fetch(`/api/users/${userId}`);

                    if (response.ok) {
                        const data = await response.json();
                        const userFromDb = data.user_id;

                        if (userId !== userFromDb) {
                            setError('ID пользователя не совпадает с данным в базе данных');
                            setLoading(false);
                            return;
                        }

                        setUser(userFromDb);
                    } else {
                        setError('Пользователь не найден в базе данных');
                    }
                } catch (err) {
                    console.error(err);
                    setError('Ошибка при загрузке данных пользователя');
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        }
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    const handleQuantityChange = (id: string, quantity: number) => {
        const updatedCart = cart.map(item =>
            item._id === id ? {...item, quantity} : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleRemoveItem = (id: string) => {
        const updatedCart = cart.filter(item => item._id !== id);
        setCart(updatedCart);
        if (updatedCart.length === 0) {
            localStorage.removeItem('cart');
        } else {
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    // const handleRemoveCart = () => {
    //     localStorage.removeItem('cart');
    // };

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleOpenDatePicker = () => {
        setShowDatePicker(true);
    };

    const handleCloseDatePicker = () => {
        setShowDatePicker(false);
    };

    const handleDateTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setSelectedDateTime((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveDateTime = () => {
        const currentDate = new Date();
        const selectedDate = new Date(selectedDateTime.date);
        const selectedTime = selectedDateTime.time ? new Date(`${selectedDateTime.date}T${selectedDateTime.time}:00`) : null;

        const minTime = new Date(currentDate.getTime() + 30 * 60 * 1000); // минимум через 30 минут
        const maxDate = new Date();
        maxDate.setDate(currentDate.getDate() + 14); // максимум через 14 дней

        const minAllowedTime = new Date(selectedDate);
        minAllowedTime.setHours(10, 0, 0, 0); // 10:00
        const maxAllowedTime = new Date(selectedDate);
        maxAllowedTime.setHours(23, 30, 0, 0); // 11:30

        if (selectedDate < currentDate) {
            setErrorMessage("Выберите дату и время не раньше текущего момента.");
            return;
        }

        if (selectedTime && selectedTime < minTime) {
            setErrorMessage("Выберите время не раньше чем через 30 минут.");
            return;
        }

        if (selectedDate > maxDate) {
            setErrorMessage("Выберите дату не позже чем через 14 дней.");
            return;
        }

        if (selectedTime && (selectedTime < minAllowedTime || selectedTime > maxAllowedTime)) {
            setErrorMessage("Выберите время между 10:00 и 23:30.");
            return;
        }

        setErrorMessage(null);

        setShowPaymentModal(true); // Показать модальное окно для оплаты
    };

    const handlePaymentSuccess = async () => {
        setPaymentSuccess(true);
        setErrorMessage(null); // Сбрасываем ошибку, если платеж прошел успешно

        const orderData = {
            user_id: setUser,
            predicted_date: selectedDateTime.date,
            predicted_time: selectedDateTime.time,
            products: cart.map(item => ({
                product_id: item._id,
                quantity: item.quantity,
            })),
            status: "pending",
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
                localStorage.removeItem('cart'); // Удаляем корзину из localStorage
            } else {
                alert(`Ошибка: ${data.message}`);
            }
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            alert('Ошибка при отправке заказа');
        } finally {
            setShowPaymentModal(false); // Скрыть модальное окно оплаты
        }
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
                                <Image
                                    src='https://picsum.photos/id/237/200/300'
                                    alt={item.name}
                                    width={20}
                                    height={20}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
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
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            onClick={handleOpenDatePicker}
                        >
                            Выберите время
                        </button>
                    </div>
                )}
                {showDatePicker && (
                    <div className="mt-4 p-4 rounded-lg bg-white shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Выберите дату и время:</h2>
                        <div>
                            <DatePicker
                                selected={selectedDateTime.date ? new Date(selectedDateTime.date) : null}
                                onChange={(date: Date | null) => setSelectedDateTime(prev => ({
                                    ...prev,
                                    date: date ? date.toISOString().split('T')[0] : ""
                                }))}

                                dateFormat="yyyy-MM-dd"
                                minDate={new Date()}
                                maxDate={new Date(new Date().setDate(new Date().getDate() + 14))}
                                className="p-2 border border-gray-300 rounded-lg w-full mb-4"
                                showMonthYearDropdown={true}
                            />
                            <input
                                type="time"
                                name="time"
                                value={selectedDateTime.time}
                                onChange={handleDateTimeChange}
                                className="p-2 border border-gray-300 rounded-lg w-full mb-4"
                            />
                        </div>
                        {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                onClick={handleSaveDateTime}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Сохранить
                            </button>
                            <button
                                onClick={handleCloseDatePicker}
                                className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                )}
                {showPaymentModal && (
                    <div className="mt-6 p-4">
                        <PayPalButtons
                            createOrder={(data, actions) => {
                                if (!actions?.order) throw new Error("Order actions undefined");
                                return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [
                                        {
                                            amount: {
                                                currency_code: "EUR",
                                                value: totalPrice.toString(),
                                            },
                                        },
                                    ],
                                });
                            }}
                            onApprove={(data, actions) => {
                                if (!actions?.order) throw new Error("Order actions undefined");
                                return actions.order.capture().then((details) => {
                                    const name = details?.payer?.name?.given_name || "Клиент";
                                    alert(`Платеж выполнен: ${name}`);
                                    handlePaymentSuccess()
                                });
                            }}
                        />
                    </div>
                )}
            </div>
            <Footer/>
        </>
    );
};

export default Cart;
