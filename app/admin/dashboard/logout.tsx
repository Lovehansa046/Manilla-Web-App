'use client';

import React, {useState} from 'react';
import Link from 'next/link';

export default function Logout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    async function logout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.clear();
                window.location.href = '/';
            } else {
                console.error('Ошибка при выходе:', response.status);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    return (
        <nav className="bg-gray-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Логотип */}
                    <div className="flex-shrink-0">
                        <Link href="/admin/dashboard" className="text-xl font-semibold text-white hover:opacity-80">
                            Dashboard<span className="text-indigo-500">Panel</span>
                        </Link>
                    </div>

                    {/* Основное меню */}
                    <div className="hidden md:flex space-x-6 items-center">
                        {/*<Link href="/admin/dashboard"*/}
                        {/*      className="text-white text-lg hover:text-gray-400 transition duration-300">*/}
                        {/*    Dashboard*/}
                        {/*</Link>*/}
                        {/*<Link href="/admin/settings"*/}
                        {/*      className="text-white text-lg hover:text-gray-400 transition duration-300">*/}
                        {/*    Настройки*/}
                        {/*</Link>*/}
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Мобильное меню кнопка */}
                    <div className="md:hidden">
                        <button
                            className="text-white focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16m-7 6h7"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Мобильное меню */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-900 p-4">
                    <div className="space-y-4">
                        {/*<Link href="/admin/dashboard"*/}
                        {/*      className="block text-white text-lg hover:text-gray-400 transition duration-300">*/}
                        {/*    Dashboard*/}
                        {/*</Link>*/}
                        {/*<Link href="/admin/settings"*/}
                        {/*      className="block text-white text-lg hover:text-gray-400 transition duration-300">*/}
                        {/*    Настройки*/}
                        {/*</Link>*/}
                        <button
                            onClick={logout}
                            className="block w-full text-white bg-red-600 hover:bg-red-700 text-lg py-2 rounded-md transition duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
