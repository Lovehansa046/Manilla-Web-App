'use client'

import {useEffect, useState} from "react";
import {format} from "date-fns";

const SellerOrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/seller/orders", {
                    method: "GET",
                });
                const data = await response.json();
                setOrders(data.orders); // Сохраняем заказы в state
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const today = format(new Date(), "yyyy-MM-dd");
    const tomorrow = format(new Date(Date.now() + 86400000), "yyyy-MM-dd");

    const todayOrders = orders.filter((order) => order.predicted_date === today);
    const tomorrowOrders = orders.filter((order) => order.predicted_date === tomorrow);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Orders for Today and Tomorrow</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Orders for Today ({today}):</h2>
                    {todayOrders.length === 0 ? (
                        <p>No orders for today.</p>
                    ) : (
                        <ul className="space-y-4">
                            {todayOrders.map((order) => (
                                <li key={order._id} className="p-4 border rounded-md shadow-md mb-4">
                                    <p><strong>Order ID:</strong> {order._id}</p>
                                    <p><strong>User ID:</strong> {order.user_id}</p>
                                    <p><strong>Predicted
                                        Date:</strong> {new Date(order.predicted_date).toLocaleDateString()}</p>
                                    <p><strong>Predicted Time:</strong> {order.predicted_time}</p>
                                    <p><strong>Status:</strong> {order.status}</p>
                                    <div>
                                        <strong>Products:</strong>
                                        <ul className="space-y-2">
                                            {order.products.map((product: any) => (
                                                <li key={product.product_id} className="flex justify-between">
                                                    <span>{product.productDetails?.name || 'Неизвестный продукт'}</span>
                                                    <span>{product.quantity} x ${product.productDetails?.price || 0}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <h2 className="text-xl font-semibold mb-2 mt-4">Orders for Tomorrow ({tomorrow}):</h2>
                    {tomorrowOrders.length === 0 ? (
                        <p>No orders for tomorrow.</p>
                    ) : (
                        <ul className="space-y-4">
                            {tomorrowOrders.map((order) => (
                                <li key={order._id} className="p-4 border rounded-md shadow-md mb-4">
                                    <p><strong>Order ID:</strong> {order._id}</p>
                                    <p><strong>User ID:</strong> {order.user_id}</p>
                                    <p><strong>Predicted
                                        Date:</strong> {new Date(order.predicted_date).toLocaleDateString()}</p>
                                    <p><strong>Predicted Time:</strong> {order.predicted_time}</p>
                                    <p><strong>Status:</strong> {order.status}</p>
                                    <div>
                                        <strong>Products:</strong>
                                        <ul className="space-y-2">
                                            {order.products.map((product: any) => (
                                                <li key={product.product_id} className="flex justify-between">
                                                    <span>{product.productDetails?.name || 'Неизвестный продукт'}</span>
                                                    <span>{product.quantity} x ${product.productDetails?.price || 0}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default SellerOrdersPage;
