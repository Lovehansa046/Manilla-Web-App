"use client"

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function HomePage() {
    return (
        <>
            <Navbar></Navbar>
            <div className="offer" data-id="8:220">
                <div className="pre-offer">
                    <div className="img" data-id="8:206">
                        <img className="picture-offer" src="/image/721b4b3c36cdbeb31a126bf749555a9d.jpg"
                             alt="Блюдо недели"/>
                    </div>
                    <div className="text">
                        <div className="text-title" data-id="8:194">
                            "Блюдо недели — Карбонара! Безумная скидка, не упусти шанс насладиться классикой итальянской
                            кухни по невероятной цене!"
                        </div>
                        <div className="price" data-id="8:207">12,99$</div>
                    </div>
                </div>
            </div>
            <div className="offer" data-id="8:220">
                <div className="pre-offer">
                    <div className="img" data-id="8:206">
                        <img className="picture-offer" src="/image/721b4b3c36cdbeb31a126bf749555a9d.jpg"
                             alt="Блюдо недели"/>
                    </div>
                    <div className="text">
                        <div className="text-title" data-id="8:194">
                            "Блюдо недели — Карбонара! Безумная скидка, не упусти шанс насладиться классикой итальянской
                            кухни по невероятной цене!"
                        </div>
                        <div className="price" data-id="8:207">12,99$</div>
                    </div>
                </div>
            </div>
            <div className="offer" data-id="8:220">
                <div className="pre-offer">
                    <div className="img" data-id="8:206">
                        <img className="picture-offer" src="/image/721b4b3c36cdbeb31a126bf749555a9d.jpg"
                             alt="Блюдо недели"/>
                    </div>
                    <div className="text">
                        <div className="text-title" data-id="8:194">
                            "Блюдо недели — Карбонара! Безумная скидка, не упусти шанс насладиться классикой итальянской
                            кухни по невероятной цене!"
                        </div>
                        <div className="price" data-id="8:207">12,99$</div>
                    </div>
                </div>
            </div>

            <Footer></Footer>
        </>
    )
}