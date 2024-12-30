import {useEffect, useState} from 'react';

interface ProductType {
    _id: string;
    name: string;
}

const ProductForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [productTypeId, setProductTypeId] = useState('');
    const [isAlcoholic, setIsAlcoholic] = useState(false);
    const [quantityAvailable, setQuantityAvailable] = useState('');
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const response = await fetch('/api/admin/product-types'); // Замените на реальный API
                const data = await response.json();
                setProductTypes(data);
            } catch (error) {
                console.error('Ошибка при загрузке типов продуктов:', error);
            }
        };

        fetchProductTypes();
    }, []);

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setImage('');
        setProductTypeId('');
        setIsAlcoholic(false);
        setQuantityAvailable('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            name,
            description,
            price: parseFloat(price),
            image,
            product_type_id: productTypeId,
            is_alcoholic: isAlcoholic,
            quantity_available: parseInt(quantityAvailable, 10),
        };

        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`Продукт успешно добавлен. ID: ${data.productId}`);
                resetForm(); // Сброс формы
            } else {
                setMessage(data.message || 'Ошибка при добавлении продукта');
            }
        } catch {
            setMessage('Ошибка при отправке данных');
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Создание продукта</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Название:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Описание:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Цена:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Изображение (URL):</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Тип продукта:</label>
                    <select
                        value={productTypeId}
                        onChange={(e) => setProductTypeId(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="" disabled>
                            Выберите тип продукта
                        </option>
                        {productTypes.map((type) => (
                            <option key={type._id} value={type._id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Алкогольный:</label>
                    <input
                        type="checkbox"
                        checked={isAlcoholic}
                        onChange={() => setIsAlcoholic(!isAlcoholic)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Количество доступно:</label>
                    <input
                        type="number"
                        value={quantityAvailable}
                        onChange={(e) => setQuantityAvailable(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Создать продукт
                </button>
            </form>
            {message && (
                <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>
            )}
        </div>
    );
};

export default ProductForm;
