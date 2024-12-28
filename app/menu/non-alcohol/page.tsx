"use client"

import React, {useEffect, useState} from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductGrid from "@/app/menu/SIMPLE_FUNCTION_PAGE/ProductPage";

export default function NonAlcoholPage() {
    const [products, setProducts] = useState([]);
    const [localStorageChange, setLocalStorageChange] = useState(false);

    // Функция для загрузки продуктов
    const fetchProducts = async () => {
        const response = await fetch("/api/products?type_product=676ff0d7b9d06b03ed1af1bb"); // Пример фильтрации по типу
        const data = await response.json();
        setProducts(data.products);
    };

    useEffect(() => {
        // Загрузка продуктов при монтировании компонента
        fetchProducts();

        // Слушаем изменения в localStorage
        const handleStorageChange = () => {
            // Если данные изменились в localStorage, обновляем состояние
            setLocalStorageChange(prev => !prev);  // Триггерим обновление данных
        };

        window.addEventListener("storage", handleStorageChange);

        // Очистка при размонтировании компонента
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []); // Пустой массив зависимостей, чтобы функция вызвалась только один раз при монтировании

    useEffect(() => {
        if (localStorageChange) {
            // Если что-то изменилось в localStorage, обновляем данные
            fetchProducts();
        }
    }, [localStorageChange]); // Следим за изменениями в localStorage

    return (
        <>
            <Navbar/>
            <ProductGrid products={products}/>
            <Footer/>
        </>
    );
}
