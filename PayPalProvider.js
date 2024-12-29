'use client';

import {PayPalScriptProvider} from "@paypal/react-paypal-js";

export default function PayPalProvider({children}) {
    const initialOptions = {
        "client-id": "AcI8i_5gIei4fTvUl9d757Gsk0HnF8b_guJh2Ffp0EAmrCk3l06dZJjGL0VcYD0LX5esWWsQFyyWG7vK",
        "currency": "EUR", // Используем currency_code вместо currency
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            {children}
        </PayPalScriptProvider>
    );
}
