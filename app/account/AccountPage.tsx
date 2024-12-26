"use client";

import React, {useState} from "react";
import {useRouter} from 'next/navigation';

const AccountPage = () => {
    const [userData] = useState({
        name: "Иван",
        surname: "Иванов",
        email: "ivan@example.com",
        subscriptionStatus: "Активна", // Статус подписки
        cardNumber: "**** **** **** 1234", // Номер карты скрыт
    });

    const router = useRouter(); // Хук для навигации

    const handleGoToAccountSettings = () => {
        router.push("/account/settings"); // Переход к настройкам аккаунта
    };

    const handleGoHome = () => {
        router.push("/home"); // Переход на главную страницу
    };

    return (
        <div className="max-w-3xl mx-auto p-6 shadow-lg border rounded-lg bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Данные аккаунта</h2>

            {/* Информация о пользователе */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700">Личные данные</h3>
                <div className="mt-4">
                    <p className="text-sm text-gray-600"><strong>Имя:</strong> {userData.name}</p>
                    <p className="text-sm text-gray-600"><strong>Фамилия:</strong> {userData.surname}</p>
                    <p className="text-sm text-gray-600"><strong>Email:</strong> {userData.email}</p>
                </div>
            </div>

            {/* Платежные данные */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700">Платежные данные</h3>
                <div className="mt-4">
                    <p className="text-sm text-gray-600"><strong>Статус подписки:</strong> {userData.subscriptionStatus}
                    </p>
                    <p className="text-sm text-gray-600"><strong>Номер карты:</strong> {userData.cardNumber}</p>
                </div>
            </div>

            {/* Кнопки перехода */}
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
