"use client"

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductGrid from "@/app/components/ProductPage"
import sampleProducts from "@/app/components/sampleProducts.json"




export default function Main_courses() {
    return (
        <>
            <Navbar></Navbar>

            <ProductGrid products={sampleProducts}/>

            <Footer></Footer>
        </>
    )
}