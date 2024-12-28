'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Navbar from "@/app/admin/admin_components/navbar";


interface User {
    _id: string;
    FirstName: string;
    LastName: string;
    Email: string;
    role_id: string;
}

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]); // Указываем тип состояния users
    const [loading, setLoading] = useState(true);
    const [error /// Если не используете, удалите эту строку
        , setError] = useState('');


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Запрашиваем список пользователей
                const response = await fetch('/api/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.users);
                } else {
                    if (response.status === 403) {
                        router.push('/'); // Перенаправление для обычных пользователей
                    }
                    const errorData = await response.json();
                    setError(errorData.message || 'Не удалось загрузить пользователей');
                }
            } catch (error) {
                console.error(error);
                setError('Ошибка при загрузке пользователей');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [router]);

    if (loading) {
        return <div className="text-center">Загрузка...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="p-4">
                <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">Список пользователей</h1>
                {users.length > 0 ? (
                    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                        <table className="w-full table-auto text-sm text-gray-700">
                            <thead className="bg-gray-200 text-gray-600">
                            <tr>
                                <th className="px-6 py-3 text-left">ID</th>
                                <th className="px-6 py-3 text-left">Имя</th>
                                <th className="px-6 py-3 text-left">Фамилия</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Роль</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user, index) => (
                                <tr
                                    key={user._id}
                                    className={`${
                                        index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                                    } hover:bg-gray-200 transition-colors duration-300 cursor-pointer`}
                                    onClick={() => router.push(`/admin/users/${user._id}`)} // Перенаправление на страницу пользователя
                                >
                                    <td className="px-6 py-4">{user._id}</td>
                                    <td className="px-6 py-4">{user.FirstName}</td>
                                    <td className="px-6 py-4">{user.LastName}</td>
                                    <td className="px-6 py-4">{user.Email}</td>
                                    <td className="px-6 py-4">
                                        {user.role_id === '6768119b5157a6cf573ca551' ? 'Администратор' : 'Клиент'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-6">Пользователи не найдены</div>
                )}
            </div>

        </>
    );
}
