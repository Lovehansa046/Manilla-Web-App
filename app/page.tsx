"use client"

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";

export default function HomePage() {
    return (
        <>
            <Navbar></Navbar>
            <div className="offer" data-id="8:220">
                <div className="pre-offer">
                    <div className="img" data-id="8:206">
                        <Image className="picture-offer" src="/image/721b4b3c36cdbeb31a126bf749555a9d.jpg" width={300} height={300}
                               alt="Блюдо недели"/>
                    </div>
                    <div className="text">
                        <div className="text-title" data-id="8:194">
                            &quot;Блюдо недели — Карбонара! Безумная скидка, не упусти шанс насладиться классикой
                            итальянской
                            кухни по невероятной цене!&quot;
                        </div>
                        <div className="price" data-id="8:207">12,99$</div>
                    </div>
                </div>
            </div>
            <div className="offer" data-id="8:220">
                <div className="pre-offer">
                    <div className="img" data-id="8:206">
                        <Image className="picture-offer" src="/image/721b4b3c36cdbeb31a126bf749555a9d.jpg" width={300} height={300}
                               alt="Блюдо недели"/>
                    </div>
                    <div className="text">
                        <div className="text-title" data-id="8:194">
                            &quot;Блюдо недели — Карбонара! Безумная скидка, не упусти шанс насладиться классикой
                            итальянской
                            кухни по невероятной цене!&quot;
                        </div>
                        <div className="price" data-id="8:207">12,99$</div>
                    </div>
                </div>
            </div>
            <div className="offer" data-id="8:220">
                <div className="pre-offer">
                    <div className="img" data-id="8:206">
                        <Image className="picture-offer" src="/image/721b4b3c36cdbeb31a126bf749555a9d.jpg" width={300} height={300}  alt="Блюдо недели"/>
                    </div>
                    <div className="text">
                        <div className="text-title" data-id="8:194">
                            &quot;Блюдо недели — Карбонара! Безумная скидка, не упусти шанс насладиться классикой
                            итальянской
                            кухни по невероятной цене!&quot;
                        </div>
                        <div className="price" data-id="8:207">12,99$</div>
                    </div>
                </div>
            </div>
            <div className="main_page">
                <div className="Great-offer">
                    <div className="Great-text-offer">
                        Наиболее популярные
                    </div>
                    <div className="cards-container">
                        <div className="card">
                            <Image src="/image/crop__2_2.jpg" width={300} height={300} alt="Лазанья классическая"/>
                            <div className="card-body">
                                <h3>Лазанья классическая</h3>
                                <p>10,99$</p>
                                <button className="add-btn">+</button>
                            </div>
                        </div>
                        <div className="card">
                            <Image src="/image/crop__2_2.jpg"  width={300} height={300} alt="Лазанья классическая"/>
                            <div className="card-body">
                                <h3>Лазанья классическая</h3>
                                <p>10,99$</p>
                                <button className="add-btn">+</button>
                            </div>
                        </div>
                        <div className="card">
                            <Image src="/image/crop__2_2.jpg" width={300} height={300} alt="Лазанья классическая"/>
                            <div className="card-body">
                                <h3>Лазанья классическая</h3>
                                <p>10,99$</p>
                                <button className="add-btn">+</button>
                            </div>
                        </div>
                        <div className="card">
                            <Image src="/image/crop__2_2.jpg" width={300} height={300} alt="Лазанья классическая"/>
                            <div className="card-body">
                                <h3>Лазанья классическая</h3>
                                <p>10,99$</p>
                                <button className="add-btn">+</button>
                            </div>
                        </div>
                        <div className="card">
                            <Image src="/image/crop__2_2.jpg" width={300} height={300} alt="Лазанья классическая"/>
                            <div className="card-body">
                                <h3>Лазанья классическая</h3>
                                <p>10,99$</p>
                                <button className="add-btn">+</button>
                            </div>
                        </div>
                        <div className="card">
                            <Image src="/image/crop__2_2.jpg" width={300} height={300} alt="Лазанья классическая"/>
                            <div className="card-body">
                                <h3>Лазанья классическая</h3>
                                <p>10,99$</p>
                                <button className="add-btn">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}