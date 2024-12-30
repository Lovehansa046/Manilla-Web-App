// pages/create-product-type.js

import ProductTypeForm from "@/app/admin/admin_components/ProductTypeForm";
import Navbar from "@/app/admin/admin_components/navbar";

export default function CreateProductTypePage() {
    return (
        <div>
            <Navbar></Navbar>
            <ProductTypeForm/>
        </div>
    );
}
