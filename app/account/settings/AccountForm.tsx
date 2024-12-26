"use client";

import React, {ChangeEvent, FormEvent, useState} from "react";
import {useRouter} from 'next/navigation'; // Для навигации

const AccountForm = () => {
    const [formData, setFormData] = useState({
        name: "Иван",
        surname: "Иванов",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [isPasswordEditable, setIsPasswordEditable] = useState(false);

    const router = useRouter(); // Хук для навигации

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

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
                        value={formData.name}
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
                        value={formData.surname}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Введите ваш email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                        disabled={!isEmailEditable}
                    />
                    <button
                        type="button"
                        onClick={() => setIsEmailEditable(!isEmailEditable)}
                        className="text-blue-300 mt-2 hover:text-blue-500 transition-all duration-200"
                    >
                        {isEmailEditable ? "Закрыть редактирование" : "Редактировать email"}
                    </button>
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
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        disabled={!isPasswordEditable}
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
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        disabled={!isPasswordEditable}
                    />
                    <button
                        type="button"
                        onClick={() => setIsPasswordEditable(!isPasswordEditable)}
                        className="text-blue-300 mt-2 hover:text-blue-500 transition-all duration-200"
                    >
                        {isPasswordEditable ? "Закрыть редактирование" : "Редактировать пароль"}
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Сохранить изменения
                </button>
            </form>

            {/* Кнопки "Вернуться на главную" и "К данным аккаунта" */}
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
