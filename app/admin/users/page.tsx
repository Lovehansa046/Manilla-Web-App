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
            <Navbar userName={''}></Navbar>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Список пользователей</h1>
                {users.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">ID</th>
                            <th className="border border-gray-300 p-2">Имя</th>
                            <th className="border border-gray-300 p-2">Фамилия</th>
                            <th className="border border-gray-300 p-2">Email</th>
                            <th className="border border-gray-300 p-2">Роль</th>
                        </tr>
                        </thead>
                        <tbody>

                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="border border-gray-300 p-2">{user._id}</td>
                                <td className="border border-gray-300 p-2">{user.FirstName}</td>
                                <td className="border border-gray-300 p-2">{user.LastName}</td>
                                <td className="border border-gray-300 p-2">{user.Email}</td>
                                <td className="border border-gray-300 p-2">
                                    {user.role_id === '6768119b5157a6cf573ca551' ? 'Администратор' : 'Клиент'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center">Пользователи не найдены</div>
                )}
            </div>
        </>
    );
}
