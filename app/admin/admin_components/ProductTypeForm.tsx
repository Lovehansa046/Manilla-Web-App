'use client'

import {useState} from "react";

export default function ProductTypeForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!name) {
            setMessage("Необходимо указать имя типа продукта.");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch("/api/admin/product-types", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name, description}),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(`Тип продукта успешно создан, ID: ${result.productTypeId}`);
            } else {
                setMessage(result.message || "Произошла ошибка при создании типа продукта.");
            }
        } catch (error) {
            console.error("Ошибка при создании типа продукта:", error);
            setMessage("Ошибка при создании типа продукта.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                    Создать тип продукта
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Название типа продукта
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Описание
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            rows={4}
                        ></textarea>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600"
                            }`}
                        >
                            {loading ? "Создание..." : "Создать"}
                        </button>
                    </div>
                </form>

                {message && (
                    <p
                        className={`mt-4 text-center text-sm font-medium ${
                            message.includes("успешно")
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
