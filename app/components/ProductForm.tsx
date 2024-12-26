// components/ProductForm.js

import {useState} from 'react'

const ProductForm = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState('')
    const [productTypeId, setProductTypeId] = useState('')
    const [isAlcoholic, setIsAlcoholic] = useState(false)
    const [quantityAvailable, setQuantityAvailable] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            name,
            description,
            price,
            image,
            product_type_id: productTypeId,
            is_alcoholic: isAlcoholic,
            quantity_available: quantityAvailable,
        }

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            })

            const data = await response.json()
            if (response.ok) {
                setMessage(`Продукт успешно добавлен. ID: ${data.productId}`)
            } else {
                setMessage(data.message || 'Ошибка при добавлении продукта')
            }
        } catch (error) {
            setMessage('Ошибка при отправке данных')
        }
    }

    return (
        <div>
            <h1>Создание продукта</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Описание:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label>Цена:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Изображение (URL):</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </div>
                <div>
                    <label>Тип продукта (ID):</label>
                    <input
                        type="number"
                        value={productTypeId}
                        onChange={(e) => setProductTypeId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Алкогольный:</label>
                    <input
                        type="checkbox"
                        checked={isAlcoholic}
                        onChange={() => setIsAlcoholic(!isAlcoholic)}
                    />
                </div>
                <div>
                    <label>Количество доступно:</label>
                    <input
                        type="number"
                        value={quantityAvailable}
                        onChange={(e) => setQuantityAvailable(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Создать продукт</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default ProductForm
