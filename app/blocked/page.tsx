'use client'

import React from "react"; // Импортируем компонент Button из Float UI

export default function BlockedPage() {


    async function logout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',  // Используем POST-запрос
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Выводим сообщение

                // Очистка localStorage
                localStorage.removeItem('token'); // Удаляем токен
                localStorage.clear(); // Полная очистка, если необходимо

                // Перенаправление на главную страницу
                window.location.href = '/';
            } else {
                console.error('Ошибка при выходе:', response.status);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-white">
            <div className="text-center p-8 bg-red-600 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-4">Ваш аккаунт заблокирован</h1>
                <p className="text-xl mb-6">Пожалуйста, свяжитесь с поддержкой для получения дополнительной
                    информации.</p>
                <button
                    className="w-full text-white hover:bg-white hover:text-black hover: rounded-2xl transition duration-300"
                    onClick={() => window.location.href = 'mailto:support@example.com'}
                >
                    Связаться с поддержкой
                </button>
                <button
                    className="w-full mt-8 bg-white text-black font-bold hover:bg-black hover:text-white font-bold hover: rounded-2xl transition duration-300"
                    onClick={() => logout()}
                >
                    Выйти из аккаунта
                </button>
            </div>
        </div>
    );
}
