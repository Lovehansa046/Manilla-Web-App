'use client'

import React from 'react';
import {useRouter} from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path); // Переход на указанный путь
    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-indigo-600 text-white py-4 shadow-lg">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold">Панель управления</h1>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button
                        onClick={() => handleNavigation('/admin/create/user')}
                        className="p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                    >
                        <h2 className="text-lg font-bold text-gray-800">Создать пользователя</h2>
                        <p className="text-sm text-gray-500 mt-2">Добавление нового пользователя в систему.</p>
                    </button>

                    <button
                        onClick={() => handleNavigation('/admin/create/user/role')}
                        className="p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                    >
                        <h2 className="text-lg font-bold text-gray-800">Создать роль пользователя</h2>
                        <p className="text-sm text-gray-500 mt-2">Управление ролями учетных записей.</p>
                    </button>

                    <button
                        onClick={() => handleNavigation('/admin/block/user')}
                        className="p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                    >
                        <h2 className="text-lg font-bold text-gray-800">Заблокировать пользователя</h2>
                        <p className="text-sm text-gray-500 mt-2">Управление статусом учетных записей.</p>
                    </button>

                    <button
                        onClick={() => handleNavigation('/admin/create-type-product')}
                        className="p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                    >
                        <h2 className="text-lg font-bold text-gray-800">Создать тип продукта</h2>
                        <p className="text-sm text-gray-500 mt-2">Добавление нового типа продуктов.</p>
                    </button>

                    <button
                        onClick={() => handleNavigation('/admin/users')}
                        className="p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                    >
                        <h2 className="text-lg font-bold text-gray-800">Список пользователей</h2>
                        <p className="text-sm text-gray-500 mt-2">Посмотрите данные, а так же заказы пользователей.</p>
                    </button>

                    <button
                        onClick={() => handleNavigation('/admin/create-product')}
                        className="p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                    >
                        <h2 className="text-lg font-bold text-gray-800">Создать продукт</h2>
                        <p className="text-sm text-gray-500 mt-2">Добавление нового продукта в каталог.</p>
                    </button>

                    <button
                        onClick={() => handleNavigation('/admin/analysis')}
                        className="p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                    >
                        <h2 className="text-lg font-bold text-gray-800">Просмотреть отчеты</h2>
                        <p className="text-sm text-gray-500 mt-2">Анализ данных и управление статистикой.</p>
                    </button>

                    <button
                        onClick={() => handleNavigation('/admin/settings')}
                        className="p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-400"
                    >
                        <h2 className="text-lg font-bold text-gray-800">Настройки</h2>
                        <p className="text-sm text-gray-500 mt-2">Управление настройками приложения.</p>
                    </button>
                </div>
            </main>

            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">&copy; 2024 Manilla. Все права защищены.</p>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
