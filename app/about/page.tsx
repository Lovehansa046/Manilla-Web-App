"use client";

import Image from 'next/image'

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import React from "react";

export default function About() {
    return (
        <>
            <Navbar/>
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl sm:text-5xl font-bold text-center mb-8">О нас</h1>

                {/* Секция 1: Введение */}
                <section className="mb-12">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">Наша история</h2>
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                        **Mannilla Cafe** было основано в 2015 году с мечтой создать место, где каждый мог бы
                        насладиться уютной
                        атмосферой, вкусным кофе и уникальными блюдами. За эти годы мы стали не просто кафе, а настоящим
                        домом для наших гостей.
                    </p>
                </section>

                {/* Секция 2: Галерея */}
                <section className="mb-12">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">Галерея</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(6).fill(0).map((_, index) => (
                            <Image
                                key={index}
                                src="/image/image-removebg-preview.png"
                                alt={`Gallery ${index + 1}`}
                                width={400} height={400}
                                className="w-128 h-128 object-cover rounded-lg shadow-md"
                            />
                        ))}
                    </div>
                </section>

                {/* Секция 3: Миссия */}
                <section className="mb-12">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">Наша миссия</h2>
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                        Мы стремимся стать местом, куда хочется возвращаться. Наша команда каждый день работает над тем,
                        чтобы подарить вам лучшее обслуживание и атмосферу, которая вдохновляет.
                    </p>
                </section>

                {/* Секция 4: Социальные сети */}
                <section className="mb-12 text-center">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Присоединяйтесь к нам</h2>
                    <div className="flex justify-center gap-8">
                        <a
                            href="https://facebook.com/mannillacafe"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                            Facebook
                        </a>
                        <a
                            href="https://instagram.com/mannillacafe"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-pink-500 hover:underline"
                        >
                            Instagram
                        </a>
                    </div>
                </section>
            </div>
            <Footer/>
        </>
    );
}
