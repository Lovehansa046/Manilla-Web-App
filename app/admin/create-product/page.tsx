'use client'

import ProductForm from '@/app/admin/admin_components/ProductForm'
import Navbar from "@/app/admin/admin_components/navbar";

export default function Home() {
    return (
        <div>
            <Navbar></Navbar>
            <ProductForm/>
        </div>
    )
}
