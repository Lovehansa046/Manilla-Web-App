'use client'

import Navbar from "@/app/admin/admin_components/navbar";
import CatalogProduct from "@/app/admin/admin_components/catalogProducts";

export default function Home() {
    return (
        <div>
            <Navbar></Navbar>

            <CatalogProduct></CatalogProduct>
            {/*<ProductForm/>*/}
        </div>
    )
}
