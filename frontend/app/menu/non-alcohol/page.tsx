// app/menu/non-alcohol/page.tsx
"use client"

import React, {useEffect, useState} from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductGrid from "@/app/menu/SIMPLE_FUNCTION_PAGE/ProductPage";

export default function NonAlcoholPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch("/api/products?type_product=1"); // Пример фильтрации по типу
            const data = await response.json();
            setProducts(data.products);
        };

        fetchProducts();
    }, []);

    return (
        <>
            <Navbar/>
            <ProductGrid products={products}/>
            <Footer/>
        </>
    );
}
