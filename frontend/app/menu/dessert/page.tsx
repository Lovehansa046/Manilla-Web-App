"use client"

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductGrid from "@/app/components/simple_function_page/ProductPage"
import sampleProducts from "@/app/components/Data/sampleProducts.json"




export default function DessertPage() {
    return (
        <>
            <Navbar></Navbar>

            <ProductGrid products={sampleProducts}/>

            <Footer></Footer>
        </>
    )
}