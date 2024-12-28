"use client";

import React, {useState} from 'react';
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
        image: '', // если необходимо, можно добавить обработку изображений
        role_id: '676823d21e6062779cfd474e', // или подставить роль по умолчанию
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Регистрация прошла успешно!');
                // Перенаправление на страницу логина
                window.location.href = '/login';

            } else {
                alert(`Ошибка: ${data.message}`);
            }
        } catch (error) {
            console.error("Ошибка при отправке формы:", error);
            alert("Произошла ошибка при регистрации");
        }
    };

    return (
        <div className="main_page">
            <div className="Main">
                <div className="Logo">
                    <div className="Image">
                        <Image src="/image/image-removebg-preview.png" width={150} height={150}  className="mx-auto"
                               alt=''/>
                    </div>
                    <div className="Text-logo text-center sm:text-lg md:text-xl">
                        MANILLA — место, где каждый вкус раскрывает уютный вечер с близкими!
                    </div>
                    <div className="Text-title text-center sm:text-lg md:text-xl">
                        Ваша радость — наша забота!
                    </div>
                </div>
                <main className="w-full h-screen flex flex-col items-center justify-center px-4">
                    <div className="max-w-sm w-full text-gray-600">
                        <div className="text-center">
                            <div className="mt-5 space-y-2">
                                <h3 className="text-gray-800 text-2xl font-bold sm:text-xl md:text-2xl">Create Your
                                    MANILLA Account</h3>
                                <p className="">Already have an account? <Link href="/"
                                                                               className="font-medium text-red-500 hover:text-red-900">Sign
                                    in</Link></p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label className="font-medium">Name</label>
                                <input
                                    type="text"
                                    name="FirstName"
                                    value={formData.FirstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-900 shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium">Surname</label>
                                <input
                                    type="text"
                                    name="LastName"
                                    value={formData.LastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-900 shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium">Email</label>
                                <input
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-900 shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium">Password</label>
                                <input
                                    type="password"
                                    name="Password"
                                    value={formData.Password}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-900 shadow-sm rounded-lg"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-white font-medium bg-red-500 hover:bg-red-500 active:bg-red-900 rounded-lg duration-150">
                                Sign up
                            </button>
                            <div className="text-center">
                                <Link href="javascript:void(0)" className="hover:text-red-900">Forgot password?</Link>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
