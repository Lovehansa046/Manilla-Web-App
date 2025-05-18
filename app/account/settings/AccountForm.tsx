
"use client";

import React, {FormEvent, useEffect, useState} from "react";
import {useRouter} from 'next/navigation';

const AccountForm = () => {
    const [formData, setFormData] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter(); // Хук для навигации

    useEffect(() => {
        // Получаем user_id_token из localStorage
        const userIdToken = localStorage.getItem("user_id_token");

        if (userIdToken) {
            // Удаляем кавычки, если они есть
            const sanitizedToken = userIdToken.replace(/['"]+/g, '');

            // Добавляем token в URL при отправке запроса
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`/api/auth/${sanitizedToken}`);
                    const data = await response.json();

                    if (response.ok) {
                        setFormData({
                            ...formData,
                            FirstName: data.FirstName,
                            LastName: data.LastName,
                            Email: data.Email,  // Если вы хотите загрузить email тоже
                        });
                    } else {
                        setError(data.message || "Ошибка при получении данных пользователя");
                    }
                } catch (error) {
                    console.error("Ошибка при получении данных пользователя:", error);
                    setError("Ошибка сети");
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        } else {
            setError("Токен пользователя не найден");
            setLoading(false);
        }
    }, []); // Загружаем данные только при монтировании компонента

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Пароли не совпадают");
            return;
        }
        alert("Данные сохранены");
        // Отправьте данные на сервер
    };

    const handleGoHome = () => {
        router.push("/home"); // Переход на главную страницу
    };

    const handleGoToAccount = () => {
        router.push("/account"); // Переход к данным аккаунта
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="max-w-md mx-auto p-6 shadow-lg border rounded-lg bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Настройки аккаунта</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Имя
                    </label>
                    <input
                        type="text"
                        value={formData.FirstName}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Фамилия
                    </label>
                    <input
                        type="text"
                        value={formData.LastName}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.Email}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        disabled
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                        Новый пароль
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Введите новый пароль"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirmPassword">
                        Подтвердите пароль
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Введите пароль еще раз"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Сохранить изменения
                </button>
            </form>

            <div className="mt-6 flex justify-between">
                <button
                    onClick={handleGoHome}
                    className="w-full m-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-200"
                >
                    На главную
                </button>
                <button
                    onClick={handleGoToAccount}
                    className="w-full m-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-200"
                >
                    К аккаунту
                </button>
            </div>
        </div>
    );
};

export default AccountForm;

