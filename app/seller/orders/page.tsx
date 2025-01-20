'use client'

import {useEffect, useState} from "react";
import {format} from "date-fns";
import {Button} from "@mui/base";
import Navbar from "@/app/seller/components/navbar";

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

    const handleStatusChange = async (orderId: string) => {
        try {
            const response = await fetch(`/api/seller/orders/${orderId}/complete`, {
                method: 'PATCH',
            });
            if (response.ok) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? {...order, status: 'completed'} : order
                    )
                );
            } else {
                console.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        try {
            const response = await fetch(`/api/seller/orders/${orderId}/cancel`, {
                method: 'PATCH',
            });
            if (response.ok) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? {...order, status: 'cancelled'} : order
                    )
                );
            } else {
                console.error('Failed to cancel order');
            }
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    // const handleOrder = async (orderId: string) => {
    //     try {
    //         const response = await fetch(`/api/seller/orders/${orderId}/place`, {
    //             method: 'PATCH',
    //         });
    //         if (response.ok) {
    //             setOrders((prevOrders) =>
    //                 prevOrders.map((order) =>
    //                     order._id === orderId ? {...order, status: 'placed'} : order
    //                 )
    //             );
    //         } else {
    //             console.error('Failed to place order');
    //         }
    //     } catch (error) {
    //         console.error('Error placing order:', error);
    //     }
    // };

    return (
        <>
            <Navbar></Navbar>
            <div className="container mx-auto p-6 max-w-screen-lg bg-gray-50 rounded-lg shadow-lg">
                <h1 className="text-4xl font-semibold text-center text-blue-600 mb-8">Orders for Today and Tomorrow</h1>

            {loading ? (
                <div className="flex justify-center items-center text-xl text-gray-500">Loading...</div>
            ) : (
                <div>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders for Today ({today}):</h2>
                        {todayOrders.length === 0 ? (
                            <p className="text-lg text-gray-600">No orders for today.</p>
                        ) : (
                            <ul className="space-y-6">
                                {todayOrders.map((order) => (
                                    <li
                                        key={order._id}
                                        className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ease-in-out ${
                                            order.status === 'completed'
                                                ? 'bg-green-100 border-green-500'
                                                : order.status === 'cancelled'
                                                    ? 'bg-red-100 border-red-500'
                                                    : ''
                                        }`}
                                    >
                                        <div className="flex flex-col space-y-3">
                                            <p className="text-lg font-semibold text-gray-800">
                                                <strong>Order ID:</strong> {order._id}
                                            </p>
                                            <p className="text-gray-600">
                                                <strong>User:</strong> {order.user.first_name} {order.user.last_name}
                                            </p>
                                            <p className="text-gray-600"><strong>Email:</strong> {order.user.email}</p>
                                            <p className="text-gray-600"><strong>Predicted
                                                Date:</strong> {new Date(order.predicted_date).toLocaleDateString()}</p>
                                            <p className="text-gray-600"><strong>Predicted
                                                Time:</strong> {order.predicted_time}</p>
                                            <p className="text-gray-600"><strong>Status:</strong> {order.status}</p>
                                        </div>

                                        <div className="mt-4">
                                            <strong className="text-lg text-gray-800">Products:</strong>
                                            <ul className="space-y-3 mt-3">
                                                {order.products.map((product: any) => (
                                                    <li
                                                        key={product.product_id}
                                                        className="flex justify-between bg-gray-50 p-3 rounded-md shadow-sm hover:bg-gray-100 transition-all duration-300"
                                                    >
                                                        <span
                                                            className="text-gray-700">{product.productDetails?.name || 'Unknown product'}</span>
                                                        <span
                                                            className="text-gray-500">{product.quantity} x ${product.productDetails?.price || 0}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-6 flex justify-between">
                                            <Button
                                                onClick={() => handleStatusChange(order._id)}
                                                className={`bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out ${
                                                    order.status === 'completed' ? 'bg-green-500 cursor-not-allowed' : ''
                                                }`}
                                                disabled={order.status === 'completed'}
                                            >
                                                {order.status === 'completed' ? 'Completed' : 'Mark as Completed'}
                                            </Button>

                                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                                                <Button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>

                                        {/*{order.status !== 'completed' && order.status !== 'cancelled' && (*/}
                                        {/*    <div className="mt-6 flex justify-start">*/}
                                        {/*        <Button*/}
                                        {/*            onClick={() => handleOrder(order._id)}*/}
                                        {/*            className="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600 transition duration-300 ease-in-out"*/}
                                        {/*        >*/}
                                        {/*            Place Order*/}
                                        {/*        </Button>*/}
                                        {/*    </div>*/}
                                        {/*)}*/}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders for Tomorrow ({tomorrow}):</h2>
                        {tomorrowOrders.length === 0 ? (
                            <p className="text-lg text-gray-600">No orders for tomorrow.</p>
                        ) : (
                            <ul className="space-y-6">
                                {tomorrowOrders.map((order) => (
                                    <li
                                        key={order._id}
                                        className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ease-in-out ${
                                            order.status === 'completed'
                                                ? 'bg-green-100 border-green-500'
                                                : order.status === 'cancelled'
                                                    ? 'bg-red-100 border-red-500'
                                                    : ''
                                        }`}
                                    >
                                        <div className="flex flex-col space-y-3">
                                            <p className="text-lg font-semibold text-gray-800">
                                                <strong>Order ID:</strong> {order._id}
                                            </p>
                                            <p className="text-gray-600">
                                                <strong>User:</strong> {order.user.first_name} {order.user.last_name}
                                            </p>
                                            <p className="text-gray-600"><strong>Email:</strong> {order.user.email}</p>
                                            <p className="text-gray-600"><strong>Predicted
                                                Date:</strong> {new Date(order.predicted_date).toLocaleDateString()}</p>
                                            <p className="text-gray-600"><strong>Predicted
                                                Time:</strong> {order.predicted_time}</p>
                                            <p className="text-gray-600"><strong>Status:</strong> {order.status}</p>
                                        </div>

                                        <div className="mt-4">
                                            <strong className="text-lg text-gray-800">Products:</strong>
                                            <ul className="space-y-3 mt-3">
                                                {order.products.map((product: any) => (
                                                    <li
                                                        key={product.product_id}
                                                        className="flex justify-between bg-gray-50 p-3 rounded-md shadow-sm hover:bg-gray-100 transition-all duration-300"
                                                    >
                                                        <span
                                                            className="text-gray-700">{product.productDetails?.name || 'Unknown product'}</span>
                                                        <span
                                                            className="text-gray-500">{product.quantity} x ${product.productDetails?.price || 0}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-6 flex justify-between">
                                            <Button
                                                onClick={() => handleStatusChange(order._id)}
                                                className={`bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out ${
                                                    order.status === 'completed' ? 'bg-green-500 cursor-not-allowed' : ''
                                                }`}
                                                disabled={order.status === 'completed'}
                                            >
                                                {order.status === 'completed' ? 'Completed' : 'Mark as Completed'}
                                            </Button>

                                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                                                <Button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>

                                        {/*{order.status !== 'completed' && order.status !== 'cancelled' && (*/}
                                        {/*    <div className="mt-6 flex justify-start">*/}
                                        {/*        <Button*/}
                                        {/*            onClick={() => handleOrder(order._id)}*/}
                                        {/*            className="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600 transition duration-300 ease-in-out"*/}
                                        {/*        >*/}
                                        {/*            Place Order*/}
                                        {/*        </Button>*/}
                                        {/*    </div>*/}
                                        {/*)}*/}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            )}
        </div>
        </>
    );
};

export default SellerOrdersPage;
