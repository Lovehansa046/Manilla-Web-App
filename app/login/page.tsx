'use client'

import React, {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage("Пожалуйста, заполните все поля");
            return;
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({Email: email, Password: password}),
            });

            const data = await response.json();

            if (response.ok) {
                // Сохраняем token в localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user_id_token", JSON.stringify(data.user_id));

                // Сохраняем role_id в localStorage
                if (data.role_id) {
                    localStorage.setItem("role_id", data.role_id);
                }

                // Сохраняем роль
                if (data.role) {
                    localStorage.setItem("role", data.role);
                }

                // Проверяем роль пользователя
                if (data.role === "admin") {
                    window.location.href = "/admin/users"; // Администратор перенаправляется на страницу всех пользователей
                } else {
                    window.location.href = "/"; // Обычный пользователь перенаправляется на домашнюю страницу
                }
            } else {
                setErrorMessage(data.message || "Произошла ошибка");
            }
        } catch (error) {
            setErrorMessage("Ошибка при соединении с сервером");
        }
    };

    const clearCookies = () => {
        const cookies = document.cookie.split(";");
        cookies.forEach((cookie) => {
            const cookieName = cookie.split("=")[0].trim();
            document.cookie = `${cookieName}=; path=/; domain=${window.location.hostname}; max-age=0;`;
        });
    };

    const clearLocalStorage = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role_id");
        localStorage.removeItem("role");
    };
    useEffect(() => {
        clearLocalStorage();
        clearCookies();
    }, []);

    return (
        <div className="main_page">
            <div className="Main">
                <div className="Logo">
                    <div className="Image">
                        <Image src="/image/image-removebg-preview.png" width={150} height={150} className="mx-auto"
                               alt='remove'/>
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
                                <h3 className="text-gray-800 text-2xl font-bold sm:text-xl md:text-2xl">
                                    Log In to Your MANILLA Account
                                </h3>
                                <p>
                                    Don't have an account?{" "}
                                    <Link href="/sign-up" className="font-medium text-red-500 hover:text-red-900">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                        {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label className="font-medium">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-900 shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-900 shadow-sm rounded-lg"
                                />
                            </div>

                            <button type="submit"
                                    className="w-full px-4 py-2 text-white font-medium bg-red-500 hover:bg-red-500 active:bg-red-900 rounded-lg duration-150">
                                Sign in
                            </button>

                            <div className="text-center">
                                <a href="javascript:void(0)" className="hover:text-red-900">
                                    Forgot password?
                                </a>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
