"use client"

export default function NotFound() {
    return (
        <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-9xl font-extrabold text-red-600 mb-6">
                    404
                </h1>
                <p className="text-2xl font-semibold mb-4">
                    Упс! Страница не найдена
                </p>
                <p className="text-lg mb-6">
                    К сожалению, мы не можем найти эту страницу. Она может быть перемещена или удалена.
                </p>
                <div className="flex justify-center space-x-4">
                    <a
                        href="/home"
                        className="bg-red-600 text-white py-2 px-6 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                        Вернуться на главную
                    </a>
                    <a
                        href="/account"
                        className="bg-gray-700 text-white py-2 px-6 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                        Перейти к аккаунту
                    </a>
                </div>
            </div>
        </div>
    );
}
