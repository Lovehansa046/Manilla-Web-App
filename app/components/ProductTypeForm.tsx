'use client'

import {useState} from "react";

export default function ProductTypeForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Обработчик отправки формы
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!name) {
            setMessage("Необходимо указать имя типа продукта.");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch("/api/product-types", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    description,
                }),
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
        <div>
            <h1>Создать новый тип продукта</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Название типа продукта</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">Описание</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Создание..." : "Создать"}
                    </button>
                </div>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}
