import React, {useEffect, useRef, useState} from "react";
import Image from 'next/image'
import Link from "next/link";

interface ProfileDropDownProps {
    // Укажите свойства, которые ожидаются в props
    userName: string; // Пример: имя пользователя
}


interface ProfileDropDownProps {
    class?: string; // class может быть строкой или отсутствовать
}

const ProfileDropDown: React.FC<ProfileDropDownProps> = (props) => {
    const [state, setState] = useState(false);
    const profileRef = useRef<HTMLButtonElement | null>(null); // Изменен тип на HTMLButtonElement


    async function logout() {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',  // Используем POST-запрос
        })
        const data = await response.json()
        console.log(data.message)  // Выводим сообщение
    }


    const navigation = [
        // {title: "Dashboard", path: "/account"},
        // {title: "Settings", path: "/account/settings/"},
        {title: "Log out", path: "/login"},
    ];


    useEffect(() => {
        const handleDropDown = (e: MouseEvent) => {
            // Теперь TypeScript знает, что profileRef.current имеет метод contains
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setState(false);
            }
        };
        document.addEventListener('click', handleDropDown);

        // Cleanup event listener on component unmount
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
                        width={300}
                        height={300}
                        className="w-full h-full rounded-full"
                        alt=''
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
                                <a href={item.path}>
                                    <button
                                        onClick={logout}
                                        className="bg-red-600 justify-center items-center w-full text-left text-white lg:hover:bg-red-800 lg:p-3 rounded"
                                    >
                                        {item.title}
                                    </button>
                                </a>


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

export default ProfileDropDown;