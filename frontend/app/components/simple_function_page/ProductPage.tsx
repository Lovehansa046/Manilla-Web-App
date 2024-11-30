import React from 'react';

const ProductCard = ({product}) => {
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
            <button className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                Добавить в корзину
            </button>
        </div>
    );
};

const ProductGrid = ({products}) => {
    return (
        <div className="max-w-7xl mx-auto mt-10 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
                <ProductCard key={index} product={product}/>
            ))}
        </div>
    );
};

export default ProductGrid;
