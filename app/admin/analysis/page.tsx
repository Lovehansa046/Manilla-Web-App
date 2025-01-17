// 'use client';
//
// import React, {useEffect, useState} from 'react';
//
// export default function ViewReports() {
//     const [loading, setLoading] = useState(true);
//     const [stats, setStats] = useState<any | null>(null);
//     const [error, setError] = useState<string | null>(null);
//
//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const response = await fetch('/api/admin/analysis', {
//                     method: 'GET',
//                 });
//                 if (response.ok) {
//                     const data = await response.json();
//                     setStats(data);
//                 } else {
//                     throw new Error('Ошибка загрузки статистики');
//                 }
//             } catch (err: any) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         }
//
//         fetchData();
//     }, []);
//
//     if (loading) return <div className="text-center text-gray-500">Загрузка данных...</div>;
//     if (error) return <div className="text-center text-red-500">Ошибка: {error}</div>;
//
//     return (
//         <div className="p-6">
//             <h1 className="text-3xl font-semibold text-gray-800 mb-6">Анализ продаж</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Типы продуктов */}
//                 <div className="p-4 bg-white shadow rounded-lg">
//                     <h2 className="text-lg font-bold text-gray-800 mb-4">Продажи по типам</h2>
//                     {Object.entries(stats.typeStats).map(([type, count]) => (
//                         <div key={type} className="flex justify-between text-gray-700">
//                             <span>{type}</span>
//                             <span>{count} шт.</span>
//                         </div>
//                     ))}
//                 </div>
//
//                 {/* Продажи по продуктам */}
//                 <div className="p-4 bg-white shadow rounded-lg">
//                     <h2 className="text-lg font-bold text-gray-800 mb-4">Продажи по продуктам</h2>
//                     {stats.productStats.map((product: any) => (
//                         <div key={product.name} className="flex justify-between text-gray-700">
//                             <span>{product.name}</span>
//                             <span>{product.totalSold} шт.</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }
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
