// pages/index.js
import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Home = ({products}) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        // Загрузка корзины из localStorage при монтировании компонента
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        if (savedCart) {
            setCart(savedCart);
        }
    }, []);

    useEffect(() => {
        // Сохранение корзины в localStorage при изменении состояния корзины
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    const addToCart = (product) => {
        // Проверяем, есть ли уже этот товар в корзине
        const existingProduct = cart.find(item => item._id === product._id);

        if (existingProduct) {
            // Если товар уже есть в корзине, увеличиваем его количество
            const updatedCart = cart.map(item =>
                item._id === product._id ? {...item, quantity: item.quantity + 1} : item
            );
            setCart(updatedCart);
        } else {
            // Если товара нет в корзине, добавляем его с количеством 1
            const updatedCart = [...cart, {...product, quantity: 1}];
            setCart(updatedCart);
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
                <div className="product-grid">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="product-card bg-white shadow-lg rounded-lg p-4">
                                <img
                                    src='https://picsum.photos/id/237/200/300' /*{product.image}*/
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                                <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                                <p className="text-lg font-bold text-gray-900 mt-4">{product.price} €</p>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Добавить в корзину
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>

    );
};

// Функция для получения данных с API при серверном рендеринге
// s

export default Home;
