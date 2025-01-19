'use client'

import {useState} from 'react';
import axios from 'axios';

const CreateRole = () => {
    const [formData, setFormData] = useState({roleName: '', roleDescription: ''});
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('/api/role', formData);
            setMessage(response.data.message);
            setFormData({roleName: '', roleDescription: ''});
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при создании роли');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Создать новую роль</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                            Название роли
                        </label>
                        <input
                            type="text"
                            id="roleName"
                            name="roleName"
                            value={formData.roleName}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700">
                            Описание роли
                        </label>
                        <textarea
                            id="roleDescription"
                            name="roleDescription"
                            value={formData.roleDescription}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Создать роль
                    </button>
                </form>
                {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default CreateRole;
