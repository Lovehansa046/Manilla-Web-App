'use client'

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';

interface Product {
    product_id: string;
    quantity: number;
    productDetails: {
        name: string;
        price: number;
        description: string;
    };
}

interface Order {
    _id: string;
    predicted_date: string;
    predicted_time: string;
    status: string;
    products: Product[];
    created_at: string;
}

interface User {
    FirstName: string;
    LastName: string;
    Email: string;
}

export default function UserDetails() {
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');

    const {userID} = useParams();
    const router = useRouter();

    useEffect(() => {
        if (!userID) {
            setError('Параметр userID отсутствует в URL');
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/admin/users/${userID}`);
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setOrders(data.orders);
                    setFilteredOrders(data.orders);
                } else {
                    setError('У пользователя нет заказов или его роль администратора!');
                    setTimeout(() => {
                        router.push('/admin/users');  // Перенаправление на /admin/users через 10 секунд
                    }, 5000);
                }
            } catch (err) {
                console.error(err);
                setError('Ошибка при загрузке данных');
                setTimeout(() => {
                    router.push('/admin/users');  // Перенаправление на /admin/users через 10 секунд
                }, 5000);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userID, router]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);
        if (date) {
            const filtered = orders.filter(order => order.predicted_date === date);
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders);
        }
    };

    const calculateTotalAmount = (orders: Order[]) => {
        return orders.reduce((total, order) => {
            const orderTotal = order.products.reduce((sum, product) => {
                return sum + (product.productDetails.price * product.quantity);
            }, 0);
            return total + orderTotal;
        }, 0);
    };

    if (loading) {
        return <div className="text-center text-gray-600">Загрузка...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (!user) {
        return <div className="text-center text-gray-600">Пользователь не найден</div>;
    }

    const totalAmount = calculateTotalAmount(filteredOrders);

    return (
        <>
            <div
                className="min-h-screen bg-gradient-to-r from-[#1c1c1c] via-[#2d2d2d] to-[#3a3a3a] flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-12">
                    <h1 className="text-5xl font-extrabold mb-8 tracking-tight text-center text-[#333]">Данные
                        пользователя</h1>
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-semibold text-[#1a1a1a]">{user.FirstName} {user.LastName}</h2>
                        <p className="text-xl text-[#555]">{user.Email}</p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-[#333]">Фильтрация заказов по дате</h2>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="w-full p-4 rounded-lg text-[#333] bg-[#f7f7f7] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                    </div>

                    <h2 className="text-2xl font-semibold mb-6 text-[#333]">Заказы</h2>
                    {filteredOrders.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg bg-[#f4f4f4] shadow-lg">
                            <table className="min-w-full text-left text-lg text-[#333]">
                                <thead>
                                <tr className="bg-[#e0e0e0]">
                                    <th className="px-6 py-4">Дата</th>
                                    <th className="px-6 py-4">Время</th>
                                    <th className="px-6 py-4">Статус</th>
                                    <th className="px-6 py-4">Продукты</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="border-t border-[#ccc]">
                                        <td className="px-6 py-4">{order.predicted_date}</td>
                                        <td className="px-6 py-4">{order.predicted_time}</td>
                                        <td className="px-6 py-4">{order.status}</td>
                                        <td className="px-6 py-4">
                                            {order.products.map((product) => (
                                                <div key={product.product_id} className="mb-4">
                                                    <div
                                                        className="text-lg font-semibold text-[#333]">{product.productDetails.name}</div>
                                                    <div
                                                        className="text-sm text-[#666]">{product.productDetails.description}</div>
                                                    <div
                                                        className="text-sm font-medium text-[#444]">{product.productDetails.price}€
                                                    </div>
                                                    <div className="text-sm text-[#888]">x{product.quantity}</div>
                                                </div>
                                            ))}

                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-lg text-[#666] mt-6">У этого пользователя нет заказов.</p>
                    )}

                    {selectedDate && filteredOrders.length > 0 && (
                        <div className="mt-6 text-xl font-semibold text-center text-[#333]">
                            Итоговая сумма за {selectedDate}: {totalAmount}€
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
