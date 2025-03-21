import React, {useEffect, useState} from 'react';
import Image from 'next/image';

interface Product {
    _id?: string;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
}

const Home = ({products = []}: { products?: Product[] }) => {
    const [cart, setCart] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    const addToCart = (product: Product) => {
        const existingProduct = cart.find(item => item._id === product._id);

        if (existingProduct) {
            const updatedCart = cart.map(item =>
                item._id === product._id ? {...item, quantity: item.quantity + 1} : item
            );
            setCart(updatedCart);
        } else {
            const updatedCart = [...cart, {...product, quantity: 1}];
            setCart(updatedCart);
        }
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
            {products.length === 0 ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-yellow-300 text-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-semibold">Товары данной категории ещё нет</h2>
                    </div>
                </div>
            ) : (
                <div className="product-grid">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <div
                                key={product._id || index}
                                className="product-card bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <Image
                                    src={isValidUrl(product.image) ? product.image : 'https://picsum.photos/id/237/200/300'}
                                    width={300}
                                    height={600}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                                <p className="text-lg font-bold text-gray-900 mt-4">{product.price} €</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(product);
                                    }}
                                    className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Добавить в корзину
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedProduct && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        className="bg-white p-8 rounded-lg shadow-2xl max-w-3xl w-full relative flex flex-col items-center">
                        <button
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                            onClick={() => setSelectedProduct(null)}
                        >
                            ✕
                        </button>
                        <Image
                            src={isValidUrl(selectedProduct.image) ? selectedProduct.image : 'https://picsum.photos/id/237/200/300'}
                            width={200}
                            height={400}
                            alt={selectedProduct.name}
                            className="w-200 h-400 object-cover rounded-lg mb-6"
                        />
                        <h2 className="text-3xl font-semibold text-gray-900">{selectedProduct.name}</h2>
                        <p className="text-gray-700 text-lg mt-2 text-center">{selectedProduct.description}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-4">{selectedProduct.price} €</p>
                        <button
                            onClick={() => {
                                addToCart(selectedProduct);
                                setSelectedProduct(null);
                            }}
                            className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
                        >
                            Добавить в корзину
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
