"use client"

import React, {useEffect, useState} from "react";
import Navbar from "@/app/admin/admin_components/navbar";
import ConfirmModal from "@/app/admin/admin_components/ConfirmModal";
import ProductGridAdmin from "@/app/admin/admin_components/ProductGridAdmin";
import EditProductModal from "@/app/admin/admin_components/PutProduct";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    productTypeId: string;
    quantity_available: number;
    is_alcoholic: boolean;
}

export default function NonAlcoholPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false); // Для ConfirmModal
    const [editModalOpen, setEditModalOpen] = useState(false); // Для EditProductModal
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [localStorageChange, setLocalStorageChange] = useState(false);

    const fetchProducts = async () => {
        const response = await fetch("/api/admin/products?&is_alcoholic=false");
        const data = await response.json();
        setProducts(data.products);
    };

    useEffect(() => {
        fetchProducts();
        const handleStorageChange = () => {
            setLocalStorageChange(prev => !prev);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (localStorageChange) {
            fetchProducts();
        }
    }, [localStorageChange]);

    const handleEdit = (id: string) => {
        const product = products.find(product => product._id === id);
        if (product) {
            setSelectedProduct(product); // Устанавливаем выбранный продукт
            setEditModalOpen(true); // Открываем модальное окно редактирования
        }
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false); // Закрытие модального окна редактирования
        setSelectedProduct(null); // Очистка выбранного продукта
    };

    const handleUpdateProduct = async (updatedProduct: Product) => {
        const response = await fetch(`/api/admin/products/update?product_id=${updatedProduct._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
            fetchProducts();
            setEditModalOpen(false);
        } else {
            alert("Не удалось обновить продукт.");
        }
    };


    const confirmDelete = (id: string) => {
        setSelectedProductId(id);
        setConfirmModalOpen(true); // Открываем ConfirmModal для подтверждения удаления
    };

    const deleteConfirmedProduct = async () => {
        if (!selectedProductId) return;

        const confirmed = confirm("Вы уверены, что хотите удалить этот продукт?");
        if (!confirmed) return;

        const response = await fetch(`/api/admin/products/delete?product_id=${selectedProductId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            setSelectedProductId(null); // Очистка выбранного продукта
            fetchProducts(); // Обновить список продуктов
        } else {
            alert("Не удалось удалить продукт.");
        }
    };

    return (
        <>
            <Navbar/>
            <ProductGridAdmin products={products} onEdit={handleEdit} onDelete={confirmDelete}/>
            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={deleteConfirmedProduct}
                message="Вы уверены, что хотите удалить этот продукт?"
            />

            {editModalOpen && selectedProduct && (
                <EditProductModal
                    isOpen={editModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleUpdateProduct}
                    productData={selectedProduct} // Передаем выбранный продукт
                />
            )}
        </>
    );
}
