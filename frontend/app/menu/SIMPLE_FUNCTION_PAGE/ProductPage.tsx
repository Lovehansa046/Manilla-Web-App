import React, {useEffect, useState} from 'react';

const ProductGrid = ({products}) => {
    const [cart, setCart] = useState([]);

    // Компонент карточки продукта
    const ProductCard = ({product, addToCart}) => {
        return (
            <div className="bg-white shadow-lg rounded-lg p-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                <p className="text-lg font-bold text-gray-900 mt-4">{product.price} €</p>
                <button
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                    Добавить в корзину
                </button>
            </div>
        );
    };

    // Функция для добавления товара в корзину
    const addToCart = (product) => {
        setCart((prevCart) => {
            const productExists = prevCart.find(item => item.id === product.id);
            if (productExists) {
                return prevCart.map(item =>
                    item.id === product.id ? {...item, quantity: item.quantity + 1} : item
                );
            }
            return [...prevCart, {...product, quantity: 1}];
        });

        window.location.reload(); // Принудительно обновляем страницу после добавления товара в корзину
    };

    // Сохранение корзины в localStorage
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart]);

    // Загрузка корзины из localStorage
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart"));
        if (savedCart) {
            setCart(savedCart);
        }
    }, []);

    // Очистка корзины через 5 минут
    useEffect(() => {
        const timer = setTimeout(() => {
            setCart([]);
            localStorage.removeItem("cart");
        }, 5 * 60 * 1000);

        return () => clearTimeout(timer);
    }, []);

    // Проверка наличия продуктов в корзине
    useEffect(() => {
        if (cart.length > 0) {
            console.log("Товары в корзине:", cart);
        }
    }, [cart]);

    if (products.length === 0) {
        return (
            <div className="text-center text-gray-500">Нет продуктов для отображения</div>
        );
    }

    return (
        <div>
            <div className="max-w-7xl mx-auto mt-10 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} addToCart={addToCart}/>
                ))}
            </div>

            <div
                className="fixed bottom-6 right-6 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
            </div>
        </div>
    );
};

export default ProductGrid;
