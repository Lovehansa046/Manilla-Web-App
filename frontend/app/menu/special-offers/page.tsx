"use client"

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductGrid from "@/app/menu/SIMPLE_FUNCTION_PAGE/ProductPage"
import sampleProducts from "@/app/components/DATA/sampleProducts.json"




export default function SpecialOffersPage() {
    return (
        <>
            <Navbar></Navbar>

            <ProductGrid products={sampleProducts}/>

            <Footer></Footer>
        </>
    )
}