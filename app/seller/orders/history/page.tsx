'use client';

import {useEffect, useState} from 'react';
import Navbar from "@/app/seller/components/navbar";

interface Order {
    _id: string; // Укажите, если ID строки
    predicted_date: string;
    status: string;
    amount?: number; // Если приходит сумма
}

const SellerHistoryOrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Типизация ошибки

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/seller/orders", {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Не удалось загрузить данные");
                }

                const data = await response.json();

                // Получаем текущую дату в формате YYYY-MM-DD
                const today = new Date().toISOString().split('T')[0];

                // Фильтрация заказов по дате
                const validOrders = data.orders.filter(
                    (order: Order) => order.predicted_date < today
                );
                setOrders(validOrders); // Сохраняем отфильтрованные заказы
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message); // Устанавливаем текст ошибки
                } else {
                    setError("Произошла неизвестная ошибка");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <p>Загрузка данных...</p>;
    }

    if (error) {
        return <p className="text-red-500">Ошибка: {error}</p>;
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="min-h-screen bg-gray-100 p-4">
                <h1 className="text-2xl font-bold mb-4">История заказов продавца</h1>
                {orders.length === 0 ? (
                    <p>Заказы отсутствуют.</p>
                ) : (
                    <table className="w-full bg-white shadow-md rounded border-collapse">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2 text-left">ID заказа</th>
                            <th className="border px-4 py-2 text-left">Дата</th>
                            <th className="border px-4 py-2 text-left">Сумма</th>
                            <th className="border px-4 py-2 text-left">Статус</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-100">
                                <td className="border px-4 py-2">{order._id}</td>
                                <td className="border px-4 py-2">{order.predicted_date}</td>
                                <td className="border px-4 py-2">1000€</td>
                                <td className="border px-4 py-2">{order.status}</td>

                            </tr>

                        ))}
                        </tbody>

                    </table>
                )}
            </div>
        </>
    );
};

export default SellerHistoryOrdersPage;
