"use client"

import {useState} from "react";
import AccountPage from "@/app/account/AccountPage";

export default function Account() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Функция для открытия модального окна
    const openModal = () => setIsModalOpen(true);

    // Функция для закрытия модального окна
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-4xl p-6">
                <AccountPage/>

                {/* Кнопка изменения платежных данных */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={openModal}
                        className="w-64 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors mt-4"
                    >
                        Изменить платежные данные
                    </button>
                </div>

                {/* Модальное окно */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4 text-center">Изменение платежных данных</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2"
                                           htmlFor="cardNumber">
                                        Номер карты
                                    </label>
                                    <input
                                        id="cardNumber"
                                        name="cardNumber"
                                        type="text"
                                        placeholder="Введите номер карты"
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2"
                                           htmlFor="expirationDate">
                                        Срок действия
                                    </label>
                                    <input
                                        id="expirationDate"
                                        name="expirationDate"
                                        type="text"
                                        placeholder="ММ/ГГ"
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="cvv">
                                        CVV
                                    </label>
                                    <input
                                        id="cvv"
                                        name="cvv"
                                        type="text"
                                        placeholder="Введите CVV"
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Отменить
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
