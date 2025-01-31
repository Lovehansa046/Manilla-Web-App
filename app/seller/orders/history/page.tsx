'use client';

import {useEffect, useState} from 'react';
import Navbar from "@/app/seller/components/navbar";

interface Order {
    _id: string;
    predicted_date: string;
    status: string;
    amount?: number;
}

const SellerHistoryOrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                const today = new Date().toISOString().split('T')[0];
                const validOrders = data.orders.filter((order: Order) => order.predicted_date < today);
                setOrders(validOrders);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
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
        return <p className="text-center mt-10 text-lg">Загрузка данных...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center mt-10">Ошибка: {error}</p>;
    }

    return (
        <>
            <Navbar/>
            <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4 text-center">История заказов продавца</h1>
                {orders.length === 0 ? (
                    <p className="text-center text-gray-600">Заказы отсутствуют.</p>
                ) : (
                    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl overflow-x-auto">
                        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead>
                            <tr className="bg-blue-500 text-white text-sm sm:text-base">
                                <th className="border px-2 sm:px-4 py-2 text-left">ID заказа</th>
                                <th className="border px-2 sm:px-4 py-2 text-left">Дата</th>
                                <th className="border px-2 sm:px-4 py-2 text-left">Сумма</th>
                                <th className="border px-2 sm:px-4 py-2 text-left">Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-100 text-sm sm:text-base">
                                    <td className="border px-2 sm:px-4 py-2 break-words max-w-[100px]">{order._id}</td>
                                    <td className="border px-2 sm:px-4 py-2">{order.predicted_date}</td>
                                    <td className="border px-2 sm:px-4 py-2">
                                        {order.price_bucket ? `${order.price_bucket} €` : 'Summa don`t have database, Sorry'}
                                    </td>
                                    <td className="border px-2 sm:px-4 py-2">{order.status}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default SellerHistoryOrdersPage;
