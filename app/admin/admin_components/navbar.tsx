'use client';

import React, {useState} from 'react';
import Link from 'next/link';


export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        <nav className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Логотип */}
                    <div className="flex-shrink-0">
                        <Link href="/admin/dashboard" className="text-2xl font-bold hover:text-gray-300">
                            AdminPanel
                        </Link>
                    </div>

                    {/* Основные ссылки */}
                    <div className="hidden md:flex space-x-4">
                        <Link href="/admin/dashboard" className="hover:text-gray-300">
                            Dashboard
                        </Link>
                        <Link href="/admin/users" className="hover:text-gray-300">
                            Пользователи
                        </Link>
                        <Link href="/admin/settings" className="hover:text-gray-300">
                            Настройки
                        </Link>
                        <Link href={'/login'}>
                            <button
                                onClick={logout}
                                className="bg-red-600 justify-center items-center w-full text-left text-white lg:hover:bg-red-800 lg:p-3 rounded"
                            >
                                logout
                            </button>
                        </Link>
                    </div>

                    {/* Кнопка для мобильного меню */}
                    <div className="md:hidden">
                        <button
                            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="sr-only">Открыть меню</span>
                            {isMobileMenuOpen ? (
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Мобильное меню */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        <Link href="/admin/dashboard"
                              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                            Dashboard
                        </Link>
                        <Link href="/admin/users"
                              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                            Пользователи
                        </Link>
                        <Link href="/admin/settings"
                              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                            Настройки
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
