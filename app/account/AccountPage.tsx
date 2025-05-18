"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from 'next/navigation';

const AccountPage = () => {
    const [userData, setUserData] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        subscriptionStatus: "",
        cardNumber: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("user_id_token");
        if (!token) {
            setError("Токен пользователя не найден");
            setLoading(false);
            return;
        }

        const sanitizedToken = token.replace(/['"]+/g, '');

        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/auth/${sanitizedToken}`);
                const data = await response.json();

                if (response.ok) {
                    setUserData({
                        FirstName: data.FirstName || "",
                        LastName: data.LastName || "",
                        Email: data.Email || "",
                        subscriptionStatus: data.subscriptionStatus || "Неизвестна",
                        cardNumber: data.cardNumber || "**** **** **** 0000",
                    });
                } else {
                    setError(data.message || "Ошибка при получении данных пользователя");
                }
            } catch (err) {
                setError("Ошибка сети");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleGoToAccountSettings = () => {
        router.push("/account/settings");
    };

    const handleGoHome = () => {
        router.push("/home");
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div className="text-red-600 text-center">{error}</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 shadow-lg border rounded-lg bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Данные аккаунта</h2>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700">Личные данные</h3>
                <div className="mt-4">
                    <p className="text-sm text-gray-600"><strong>Имя:</strong> {userData.FirstName}</p>
                    <p className="text-sm text-gray-600"><strong>Фамилия:</strong> {userData.LastName}</p>
                    <p className="text-sm text-gray-600"><strong>Email:</strong> {userData.Email}</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700">Платежные данные</h3>
                <div className="mt-4">
                    <p className="text-sm text-gray-600">
                        <strong>Статус подписки:</strong> {userData.subscriptionStatus}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Номер карты:</strong> {userData.cardNumber}
                    </p>
                </div>
            </div>

            <div className="flex justify-between gap-4 mt-8">
                <button
                    onClick={handleGoHome}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-200"
                >
                    На главную
                </button>
                <button
                    onClick={handleGoToAccountSettings}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-200"
                >
                    Настройки аккаунта
                </button>
            </div>
        </div>
    );
};

export default AccountPage;
