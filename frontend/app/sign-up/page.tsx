"use client";

import React from 'react';

export default function Home() {
    return (
        <div className="main_page">
            <div className="Main">
                <div className="Logo">
                    <div className="Image">
                        <img src="/image/image-removebg-preview.png" width={150} className="mx-auto"/>
                    </div>
                    <div className="Text-logo text-center sm:text-lg md:text-xl">
                        MANILLA — место, где каждый вкус раскрывает уютный вечер с близкими!
                    </div>
                    <div className="Text-title text-center sm:text-lg md:text-xl">
                        Ваша радость — наша забота!
                    </div>
                </div>
                <main className="w-full h-screen flex flex-col items-center justify-center px-4">
                    <div className="max-w-sm w-full text-gray-600">
                        <div className="text-center">
                            <div className="mt-5 space-y-2">
                                <h3 className="text-gray-800 text-2xl font-bold sm:text-xl md:text-2xl">Create Your MANILLA Account</h3>
                                <p className="">Already have an account?  <a href="/"
                                                                          className="font-medium text-red-500 hover:text-red-900">Sign
                                    in</a></p>
                            </div>
                        </div>
                        <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-5">
                            <div>
                                <label className="font-medium">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-900 shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium">Surname</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-900 shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-900 shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-900 shadow-sm rounded-lg"
                                />
                            </div>
                            <button
                                className="w-full px-4 py-2 text-white font-medium bg-red-500 hover:bg-red-500 active:bg-red-900 rounded-lg duration-150">
                                Sign up
                            </button>
                            <div className="text-center">
                                <a href="javascript:void(0)" className="hover:text-red-900">Forgot password?</a>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
