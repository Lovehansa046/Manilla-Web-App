'use client'

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Navbar from "@/app/admin/admin_components/navbar";

interface Role {
    _id: string;
    name: string;

}

export default function CreateUserForm() {
    const [roles, setRoles] = useState<{ _id: string; roleName: string }[]>([]);
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
        RoleId: ''
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchRoles() {
            try {
                const response = await axios.get('/api/role'); // Предполагается, что есть эндпоинт для получения ролей
                setRoles(response.data.roles);
            } catch (error) {
                console.error('Ошибка при загрузке ролей:', error);
            }
        }

        fetchRoles();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post('/api/admin/users/create/', formData);
            setMessage(response.data.message);
            setFormData({FirstName: '', LastName: '', Email: '', Password: '', RoleId: ''});
        } catch (error) {
            if (error instanceof Error) {
                const message = (error as any)?.response?.data?.message || 'Ошибка при создании пользователя';
                setMessage(message);
            } else {
                setMessage('Произошла неизвестная ошибка');
            }
        }
    };

    return (
        <>

            <Navbar></Navbar>

            <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Создать пользователя</h1>
                {message && <p className="mb-4 text-center text-red-500">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="FirstName">
                            Имя
                        </label>
                        <input
                            type="text"
                            id="FirstName"
                            name="FirstName"
                            value={formData.FirstName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="LastName">
                            Фамилия
                        </label>
                        <input
                            type="text"
                            id="LastName"
                            name="LastName"
                            value={formData.LastName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="Email">
                            Электронная почта
                        </label>
                        <input
                            type="email"
                            id="Email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="Password">
                            Пароль
                        </label>
                        <input
                            type="password"
                            id="Password"
                            name="Password"
                            value={formData.Password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="RoleId">
                            Роль
                        </label>
                        <select
                            id="RoleId"
                            name="RoleId"
                            value={formData.RoleId}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        >
                            <option value="" disabled>Выберите роль</option>
                            {roles.map((role) => (
                                <option key={role._id} value={role._id}>
                                    {role.roleName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Создать пользователя
                    </button>
                </form>
            </div>
        </>
    );
}
