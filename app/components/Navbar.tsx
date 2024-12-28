import React, {useEffect, useRef, useState} from 'react'
import data from '@/app/components/DATA/data_2.json';
import contracts from '@/app/components/DATA/data.json';
import payments from '@/app/components/DATA/data_3.json';
import Image from "next/image";
import Link from "next/link";

interface DrapdownState {
    idx: number | null;
    isActive: boolean;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface ProfileDropDownProps {
    userName: string; // Например, если у вас есть поле userName в props
    className?: string; // Опциональное поле для классов
    class?: string;  // Добавляем свойство class

}

interface Product {
    type: 'product';
    name: string;
    sku: string;
    price: number;
    count: number;
    sellerName: string;
    totalPrice: number;
    quantity: number;
}

interface Contract {
    type: 'contract';
    company_name: string;
    created_at: string;
    signed_at: string;
    download_document: string;
    contact_person: string;
}

interface Payment {
    type: 'payment';
    payment: string;
    legal_name: string;
    status: string;
    payment_amount: number;
}

type CombinedData = Product | Contract | Payment;


const ProfileDropDown: React.FC<ProfileDropDownProps> = (props) => {
    const [state, setState] = useState(false);
    const profileRef = useRef<HTMLButtonElement | null>(null);

    async function logout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',  // Используем POST-запрос
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Выводим сообщение

                // Очистка localStorage
                localStorage.removeItem('token'); // Удаляем токен
                localStorage.clear(); // Полная очистка, если необходимо

                // Перенаправление на главную страницу
                window.location.href = '/';
            } else {
                console.error('Ошибка при выходе:', response.status);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }


    const navigation = [
        {title: "Dashboard", path: "/account"},
        {title: "Settings", path: "/account/settings/"},
        {title: "Log out", path: "/login"}
    ];


    useEffect(() => {
        const handleDropDown = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setState(false);
            }
        };
        document.addEventListener('click', handleDropDown);

        // Очистка слушателя события при размонтировании компонента
        return () => {
            document.removeEventListener('click', handleDropDown);
        };
    }, []);

    return (
        <div className={`relative ${props.class}`}>
            <div className="flex items-center space-x-4">
                <button ref={profileRef}
                        className="w-10 h-10 outline-none rounded-full ring-offset-2 ring-gray-200 ring-2 lg:hover:ring-red-700 lg:focus:ring-red-600"
                        onClick={() => setState(!state)}
                >
                    <Image
                        src="https://randomuser.me/api/portraits/men/46.jpg"
                        width={32} height={32}
                        className="w-full h-full rounded-full" alt={''}
                    />
                </button>
                <div className="lg:hidden">
                    <span className="block">Micheal John</span>
                    <span className="block text-sm text-gray-500">john@gmail.com</span>
                </div>
            </div>
            <ul className={`bg-white top-12 right-0 mt-5 space-y-5 lg:absolute lg:border lg:rounded-md lg:text-sm lg:w-52 lg:shadow-md lg:space-y-0 lg:mt-0 ${state ? '' : 'lg:hidden'}`}>
                {
                    navigation.map((item) => (
                        <li key={item.title}>
                            {item.title === 'Log out' ? (
                                // Заменяем ссылку на кнопку для "Log out"
                                <Link href={item.path}>
                                    <button
                                        onClick={logout}
                                        className="bg-red-600 justify-center items-center w-full text-left text-white lg:hover:bg-red-800 lg:p-3 rounded"
                                    >
                                        {item.title}
                                    </button>
                                </Link>


                            ) : (
                                // Для других ссылок оставляем обычные ссылки
                                <Link className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5" href={item.path}>
                                    {item.title}
                                </Link>
                            )}
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}


const dropdownNavs = [
    {
        label: "Основное меню", navs: [
            {
                title: "Основные блюда",
                desc: "Duis aute irure dolor in reprehenderit",
                path: "/menu/main-courses",
                icon: <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24"
                           height="24">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="M21 15c0-4.625-3.507-8.441-8-8.941V4h-2v2.059c-4.493.5-8 4.316-8 8.941v2h18v-2zM2 18h20v2H2z"></path>
                    </g>
                </svg>
                ,
            },
            {
                title: "Спецпредложения",
                desc: "Duis aute irure dolor in reprehenderit",
                path: "/menu/special-offers",
                icon: <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24"
                           height="24">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="m20.749 12 1.104-1.908a1 1 0 0 0-.365-1.366l-1.91-1.104v-2.2a1 1 0 0 0-1-1h-2.199l-1.103-1.909a1.008 1.008 0 0 0-.607-.466.993.993 0 0 0-.759.1L12 3.251l-1.91-1.105a1 1 0 0 0-1.366.366L7.62 4.422H5.421a1 1 0 0 0-1 1v2.199l-1.91 1.104a.998.998 0 0 0-.365 1.367L3.25 12l-1.104 1.908a1.004 1.004 0 0 0 .364 1.367l1.91 1.104v2.199a1 1 0 0 0 1 1h2.2l1.104 1.91a1.01 1.01 0 0 0 .866.5c.174 0 .347-.046.501-.135l1.908-1.104 1.91 1.104a1.001 1.001 0 0 0 1.366-.365l1.103-1.91h2.199a1 1 0 0 0 1-1v-2.199l1.91-1.104a1 1 0 0 0 .365-1.367L20.749 12zM9.499 6.99a1.5 1.5 0 1 1-.001 3.001 1.5 1.5 0 0 1 .001-3.001zm.3 9.6-1.6-1.199 6-8 1.6 1.199-6 8zm4.7.4a1.5 1.5 0 1 1 .001-3.001 1.5 1.5 0 0 1-.001 3.001z"></path>
                    </g>
                </svg>

                ,
            },
        ]
    }, {
        label: "Напитки", navs: [
            {
                title: "Алкогольные напитки",
                desc: "Duis aute irure dolor in reprehenderit",
                path: "/menu/alcohol",
                icon: <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                    xmlSpace="preserve"
                    fill="currentColor"
                    width="24"
                    height="24"
                >
                    <g id="SVGRepo_iconCarrier">
                        <g>
                            <path
                                style={{fill: 'currentColor'}}
                                d="M313.571,186.927c-3.596-5.935-7.203-14.301-10.484-24.017h-94.161 c-3.468,10.275-7.308,19.153-11.101,25.111c-19.433,30.511-23.273,46.068-23.273,102.889v62.836L313.571,186.927z"
                            />
                            <path
                                style={{fill: 'currentColor'}}
                                d="M174.551,408.273v92.09H337.46V290.909c0-34.211-1.42-53.446-6.772-70.004L174.551,408.273z"
                            />
                        </g>
                        <polygon
                            style={{fill: 'currentColor'}}
                            points="175.389,407.273 337.46,407.273 337.46,314.182 252.969,314.182 "
                        />
                        <rect
                            x="221.097"
                            y="11.636"
                            style={{fill: 'currentColor'}}
                            width="69.818"
                            height="34.909"
                        />
                        <path
                            style={{fill: 'currentColor'}}
                            d="M290.915,162.909h-69.585c6.633-20.713,11.52-46.429,11.52-69.818V58.182h46.545v34.909 C279.395,116.48,284.282,142.196,290.915,162.909z"
                        />
                        <g>
                            <path
                                style={{fill: 'currentColor'}}
                                d="M321.693,231.715c3.13,13.556,4.131,30.836,4.131,59.194v11.636h-63.162l-19.398,23.273h82.56 v69.818H186.188v-1.327l-23.273,27.927v78.126c0,6.435,5.201,11.636,11.636,11.636H337.46c6.435,0,11.636-5.201,11.636-11.636 V290.909c0-39.459-1.967-60.567-9.786-80.349L321.693,231.715z M325.824,488.727H186.188v-69.818h139.636V488.727z"
                            />
                            <path
                                style={{fill: 'currentColor'}}
                                d="M186.188,339.782v-13.964h11.636l19.398-23.273h-31.034v-11.636c0-57.169,4.073-69.353,21.446-96.64 c12.079-18.932,25.1-62.999,25.1-101.178V58.182h46.545v34.909c0,38.179,13.021,82.246,25.088,101.178 c0.465,0.721,0.884,1.408,1.327,2.106l15.884-19.06c-9.437-18.025-19.025-54.353-19.025-84.224V11.636 C302.551,5.213,297.35,0,290.915,0h-69.818c-6.435,0-11.636,5.213-11.636,11.636v81.455c0,32.431-11.311,72.751-21.457,88.681 c-20.852,32.756-25.088,51.119-25.088,109.137v76.8L186.188,339.782z M232.733,23.273h46.545v11.636h-46.545V23.273z"
                            />
                            <path
                                style={{fill: 'currentColor'}}
                                d="M81.449,477.091c-2.63,0-5.26-0.884-7.447-2.7c-4.934-4.119-5.597-11.45-1.489-16.384 L421.603,39.098c4.119-4.934,11.439-5.609,16.396-1.489c4.934,4.119,5.597,11.45,1.489,16.384L90.397,472.902 C88.105,475.66,84.788,477.091,81.449,477.091z"
                            />
                        </g>
                    </g>
                </svg>

                ,
            },
            {
                title: "Безалкогольные напитки",
                desc: "Duis aute irure dolor in reprehenderit",
                path: "/menu/non-alcohol",
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24"
                           height="24">
                    <path
                        style={{fill: 'currentColor'}}
                        d="M303.081,162.909h-94.161c-3.468,10.287-7.308,19.153-11.101,25.111 c-19.444,30.511-23.273,46.068-23.273,102.889v209.455h162.909V290.909c0-56.82-3.828-72.378-23.273-102.889 C310.377,182.063,306.548,173.196,303.081,162.909z"
                    />
                    <rect
                        x="174.545"
                        y="314.182"
                        style={{fill: 'currentColor'}}
                        width="162.909"
                        height="93.091"
                    />
                    <rect
                        x="221.091"
                        y="11.636"
                        style={{fill: 'currentColor'}}
                        width="69.818"
                        height="34.909"
                    />
                    <path
                        style={{fill: 'currentColor'}}
                        d="M323.991,181.76c-10.135-15.919-21.446-56.239-21.446-88.669V11.636 C302.545,5.213,297.344,0,290.909,0h-69.818c-6.435,0-11.636,5.213-11.636,11.636v81.455c0,32.431-11.311,72.751-21.457,88.681 c-20.864,32.756-25.088,51.119-25.088,109.137v209.455c0,6.435,5.201,11.636,11.636,11.636h162.909 c6.435,0,11.636-5.201,11.636-11.636V290.909C349.091,232.89,344.867,214.528,323.991,181.76z M232.727,23.273h46.545v11.636 h-46.545V23.273z M325.818,488.727H186.182v-69.818h139.636V488.727z M325.818,395.636H186.182v-69.818h139.636V395.636z M325.818,302.545H186.182v-11.636c0-57.169,4.073-69.353,21.446-96.64c12.079-18.932,25.1-62.999,25.1-101.178V58.182h46.545 v34.909c0,38.179,13.021,82.246,25.088,101.178c17.385,27.287,21.457,39.471,21.457,96.64V302.545z"
                    />
                    <path
                        style={{fill: 'currentColor'}}
                        d="M290.909,162.909h-69.585c6.633-20.713,11.52-46.429,11.52-69.818V58.182h46.545v34.909 C279.389,116.48,284.276,142.196,290.909,162.909z"
                    />
                </svg>

                ,
            },
        ]
    }, {
        label: "Детское меню", navs: [
            {
                title: "Детские позиции",
                desc: "Duis aute irure dolor in reprehenderit",
                path: "/menu/kids-menu",
                icon: <svg
                    fill="currentColor"
                    width="24px" height="24px"
                    viewBox="0 0 50 50"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="M29.09375 0C28.824219 -0.03125 28.554688 0.046875 28.34375 0.21875C28.132813 0.390625 28.023438 0.636719 28 0.90625L27.8125 3.15625L21.71875 3.15625L21.5 0.9375C21.445313 0.410156 21.015625 0.0351563 20.46875 0.0625L13.125 0.375C12.851563 0.386719 12.617188 0.511719 12.4375 0.71875C12.257813 0.925781 12.160156 1.226563 12.1875 1.5L12.40625 3.5625L5.6875 4.78125C5.15625 4.878906 4.792969 5.371094 4.875 5.90625L6.6875 18L4 18C3.6875 18 3.375 18.15625 3.1875 18.40625C3 18.65625 2.945313 18.980469 3.03125 19.28125L11.4375 49.28125C11.558594 49.710938 11.957031 50 12.40625 50L37.59375 50C38.042969 50 38.441406 49.710938 38.5625 49.28125L46.96875 19.28125C47.054688 18.980469 47 18.65625 46.8125 18.40625C46.621094 18.15625 46.3125 18 46 18L42.90625 18L44.5625 9C44.613281 8.726563 44.539063 8.441406 44.375 8.21875C44.210938 7.996094 43.960938 7.84375 43.6875 7.8125L36.78125 7.0625L37.25 1.90625C37.300781 1.363281 36.914063 0.90625 36.375 0.84375 Z M 19.59375 2.09375L22.15625 26.71875C19.609375 26.199219 17.765625 25.023438 16.4375 23.71875L14.28125 2.34375 Z M 29.90625 2.09375L35.1875 2.71875L33.1875 24.0625C31.910156 25.210938 30.207031 26.207031 27.9375 26.6875 Z M 21.9375 5.15625L27.65625 5.15625L25.90625 26.9375C25.605469 26.957031 25.316406 27 25 27C24.714844 27 24.457031 26.984375 24.1875 26.96875 Z M 12.59375 5.5625L14.09375 20.53125C13.601563 19.566406 13.402344 18.84375 13.375 18.75C13.257813 18.3125 12.859375 18 12.40625 18L8.71875 18L7 6.5625 Z M 36.59375 9.03125L42.40625 9.6875L40.875 18L37.59375 18C37.144531 18 36.742188 18.316406 36.625 18.75C36.589844 18.871094 36.265625 19.976563 35.4375 21.34375Z"/>
                    </g>
                </svg>


                ,
            },
            {
                title: "десерты",
                desc: "Duis aute irure dolor in reprehenderit",
                path: "/menu/dessert",
                icon: <svg fill="currentColor" width="24px" height="24px" viewBox="0 0 64 64"
                           xmlns="http://www.w3.org/2000/svg">
                    <g data-name="Layer 14" id="Layer_14">
                        <path fillRule="evenodd"
                              d="M41,8a.988.988,0,0,0-.482.124l-40,22a.968.968,0,0,0-.147.115,1.118,1.118,0,0,0-.093.074,1,1,0,0,0-.2.294c-.005.012-.005.026-.01.039a1.011,1.011,0,0,0-.064.318c0,.013-.007.023-.007.036V55a1,1,0,0,0,1,1H63a1,1,0,0,0,1-1V31A23.026,23.026,0,0,0,41,8Zm.254,2A21.028,21.028,0,0,1,61.977,30H59.766a11.112,11.112,0,0,0-5.442-6.651,11.293,11.293,0,0,0-11.069-8.857c-.318,0-.644.016-.984.049l-.011-.022a9.569,9.569,0,0,0-2.58-3.652Zm10.79,16.7-1.466-.694-.239-1.554a7.151,7.151,0,0,0-7.084-5.963,7.97,7.97,0,0,0-1.083.091l-2.282.335-1.005-2a7.283,7.283,0,0,0-3.837-3.329l2.942-1.471c1.224.722,1.759,1.815,2.473,3.274l.333.674a1,1,0,0,0,1.047.539,9.125,9.125,0,0,1,1.412-.118,9.257,9.257,0,0,1,9.185,7.676,1,1,0,0,0,.56.752A9.171,9.171,0,0,1,57.678,30H55.41A7.029,7.029,0,0,0,52.044,26.705ZM32.148,15.01A5.839,5.839,0,0,1,37.1,17.822l1.328,2.642a1,1,0,0,0,1.039.54l2.984-.439a6.164,6.164,0,0,1,.8-.071,5.138,5.138,0,0,1,5.107,4.265l.32,2.081a1,1,0,0,0,.56.752l1.947.921A5.137,5.137,0,0,1,53.038,30H4.894ZM2,44H58v2H2Zm56-2H2V36H58ZM2,54V48H58v6Zm60,0H60V35a1,1,0,0,0-1-1H2V32H62Z"
                              clipRule="evenodd"/>
                        <path fillRule="evenodd"
                              d="M36,20.142V18a1,1,0,0,0-2,0v2.142a4,4,0,1,0,2,0ZM35,26a1.994,1.994,0,0,1-1-3.722V23a1,1,0,0,0,2,0v-.722A1.994,1.994,0,0,1,35,26Z"
                              clipRule="evenodd"/>
                    </g>
                </svg>

                // icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                //            className="w-6 h-6">
                //     <path fillRule="evenodd"
                //           d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                //           clipRule="evenodd"/>
                //     <path
                //         d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z"/>
                // </svg>

                ,
            },
        ]
    }
]

export default function Navbar() {

    // const [menuState, setMenuState] = useState(false)


    const [state, setState] = useState(false)
    const [drapdownState, setDrapdownState] = useState<DrapdownState>({
        idx: null,
        isActive: false
    });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const combinedData: CombinedData[] = [
        ...data.map(item => ({type: 'product' as const, ...item})),
        ...contracts.map(item => ({type: 'contract' as const, ...item})),
        ...payments.map(item => ({type: 'payment' as const, ...item})),
    ];


    const filteredResults = combinedData.filter(item => {
        const term = searchTerm.toLowerCase();
        if (item.type === 'product') {
            return (
                item.name.toLowerCase().includes(term) ||
                item.sku.toLowerCase().includes(term) ||
                item.sellerName.toLowerCase().includes(term)
            );
        } else if (item.type === 'contract') {
            return (
                item.company_name.toLowerCase().includes(term) ||
                item.contact_person.toLowerCase().includes(term)
            );
        } else if (item.type === 'payment') {
            return (
                item.payment.toLowerCase().includes(term) ||
                item.legal_name.toLowerCase().includes(term) ||
                item.status.toLowerCase().includes(term)
            );
        }
        return false;
    });


    // Handle input change and filter data

    // Replace javascript:void(0) paths with your paths
    const navigation = [
        {title: "Меню", path: "/marketplace", isDrapdown: true, navs: dropdownNavs},
        {title: "О нас", path: "/about", isDrapdown: false},
    ]

    useEffect(() => {
        document.onclick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (target && !target.closest(".nav-menu")) {
                setDrapdownState({isActive: false, idx: null});
            }
        };

        return () => {
            document.onclick = null; // Удаляем обработчик при размонтировании
        };
    }, []);


    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Загружаем данные о товарах из localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);


    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0); // Суммируем количество всех товаров в корзине
    };

    const totalItems = getTotalItems();

    return (
        <>
            <nav
                className={`relative z-20 bg-white w-full md:static md:text-sm md:border-none ${state ? "shadow-lg rounded-b-xl md:shadow-none" : ""}`}>
                <div className="items-center gap-x-14 px-4 max-w-screen-xl mx-auto md:flex md:px-8">
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <a href="/home">
                            <Image src="/image/image-removebg-preview.png" width={80} height={80} className="mx-auto"
                                   alt=''/>
                        </a>

                        <div className="md:hidden">
                            <button className="text-gray-500 hover:text-gray-800"
                                    onClick={() => setState(!state)}
                            >
                                {
                                    state ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20"
                                             fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                             className="w-6 h-6">
                                            <path fillRule="evenodd"
                                                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm8.25 5.25a.75.75 0 01.75-.75h8.25a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75z"
                                                  clipRule="evenodd"/>
                                        </svg>

                                    )
                                }
                            </button>
                        </div>


                    </div>

                    <div className={`nav-menu flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${state ? 'block' : 'hidden'}`}>
                        <ul className="items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                            {
                                navigation.map((item, idx) => {
                                    return (
                                        <li key={idx}>
                                            {
                                                item.isDrapdown ? (
                                                    <button
                                                        className=" text-xl w-full flex items-center justify-between gap-1 text-gray-700 hover:text-red-600"
                                                        onClick={() => setDrapdownState({
                                                            idx,
                                                            isActive: !drapdownState.isActive
                                                        })}
                                                    >
                                                        {item.title}
                                                        {
                                                            drapdownState.idx == idx && drapdownState.isActive ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                     viewBox="0 0 20 20" fill="currentColor"
                                                                     className="w-5 h-5">
                                                                    <path fillRule="evenodd"
                                                                          d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
                                                                          clipRule="evenodd"/>
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                     viewBox="0 0 20 20" fill="currentColor"
                                                                     className="w-5 h-5">
                                                                    <path fillRule="evenodd"
                                                                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                                          clipRule="evenodd"/>
                                                                </svg>
                                                            )
                                                        }
                                                    </button>
                                                ) : (
                                                    <a href={item.path}
                                                       className="block text-xl text-gray-700 hover:text-red-600">
                                                        {item.title}
                                                    </a>
                                                )
                                            }
                                            {
                                                item.isDrapdown && drapdownState.idx == idx && drapdownState.isActive ? (
                                                    <div
                                                        className="bg-white mt-6 inset-x-0 top-20 w-full md:absolute md:border-y md:shadow-md md:mt-0">
                                                        <ul className='max-w-screen-xl mx-auto grid items-center gap-6 md:p-8 md:grid-cols-2 lg:grid-cols-3'>
                                                            {item && item.navs && item.navs.map((dropdownItem, idx) => (
                                                                <li key={idx}>
                                                                    <p className="text-red-600 text-sm">{dropdownItem.label}</p>
                                                                    <ul className='mt-5 space-y-6 '>
                                                                        {dropdownItem.navs.map((navItem, idx) => (
                                                                            <li key={idx} className="group">
                                                                                <a href={navItem.path}
                                                                                   className='flex gap-3 items-center'>
                                                                                    <div
                                                                                        className='w-12 h-12 rounded-full bg-indigo-50 text-red-600 flex items-center justify-center duration-150 group-hover:bg-red-600 group-hover:text-white md:w-14 md:h-14'>
                                                                                        {navItem.icon}
                                                                                    </div>
                                                                                    <div>
                                                                    <span
                                                                        className="text-gray-800 duration-200 group-hover:text-red-600 text-sm font-medium md:text-base">{navItem.title}</span>
                                                                                        <p className='text-sm text-gray-600 group-hover:text-gray-800 mt-1'>{navItem.desc}</p>
                                                                                    </div>
                                                                                </a>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : ""
                                            }
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className={`nav-menu pb-3 mt-8 md:block md:pb-0 md:mt-0 ${state ? 'block' : 'hidden'}`}>
                        <ul className="items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                            <li>
                                <button
                                    onClick={handleSearchToggle}
                                    className=" lg text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " viewBox="0 0 24 24"
                                         fill="none"
                                         stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/>
                                    </svg>
                                </button>
                            </li>
                            <li>
                                <a href="/bucket">
                                    <button className="hover:fill-amber-300 relative">
                                        <Image src="/image/add-to-basket.svg" width={64} height={64} className="w-6"
                                               alt="Add to basket"/>
                                        {totalItems > 0 && (
                                            <span
                                                className="absolute bottom-[-5px] right-[-5px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                    </span>
                                        )}
                                    </button>
                                </a>
                            </li>
                            <ProfileDropDown class="block" userName="Sergio"/>

                        </ul>
                    </div>

                    {/* Меню для мобильных устройств */}


                    {/* Кнопка для мобильного меню */}


                    {isSearchOpen && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-40 backdrop-blur-sm">
                            <div className="relative bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-2xl">
                                <button
                                    onClick={handleSearchToggle}
                                    className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 p-3"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search across products, contracts, payments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-lg"
                                />

                                {/* Display search results */}
                                <div className="mt-4 max-h-64 overflow-y-auto">
                                    {filteredResults.length > 0 ? (
                                        filteredResults.map((item, idx) => (
                                            <div key={idx} className="border-b py-2 px-2">
                                                {item.type === 'product' && (
                                                    <div>
                                                        <p><strong>Product:</strong> {item.name}</p>
                                                        <p><strong>SKU:</strong> {item.sku}</p>
                                                        <p><strong>Seller:</strong> {item.sellerName}</p>
                                                        <p><strong>Price:</strong> ${item.price}</p>
                                                    </div>
                                                )}
                                                {item.type === 'contract' && (
                                                    <div>
                                                        <p><strong>Company:</strong> {item.company_name}</p>
                                                        <p><strong>Contact:</strong> {item.contact_person}</p>
                                                        <p><a href={item.download_document} className="text-indigo-600">Download
                                                            Document</a></p>
                                                    </div>
                                                )}
                                                {item.type === 'payment' && (
                                                    <div>
                                                        <p><strong>Payment ID:</strong> {item.payment}</p>
                                                        <p><strong>Legal Name:</strong> {item.legal_name}</p>
                                                        <p><strong>Status:</strong> {item.status}</p>
                                                        <p><strong>Amount:</strong> ${item.payment_amount}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No results found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            {
                state ? (
                    <div
                        className="z-10 fixed top-0 w-screen h-screen bg-black/20 backdrop-blur-sm md:hidden"
                        onClick={() => setState(false)}></div>
                ) : ""
            }
        </>
    )
}