// useLocalStorage.ts
import {useEffect, useState} from 'react';

const useLocalStorage = <T>(key: string) => {
    const [storedValue, setStoredValue] = useState<T | null>(() => {
        // Считываем начальное значение из localStorage
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        // Функция, которая будет вызываться, если значение в localStorage изменится
        const handleStorageChange = () => {
            const saved = localStorage.getItem(key);
            setStoredValue(saved ? JSON.parse(saved) : null);
        };

        // Подписка на событие 'storage', чтобы обновлять стейт при изменении в localStorage
        window.addEventListener('storage', handleStorageChange);

        // Очистка подписки на событие при размонтировании компонента
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    // Функция для обновления значения в localStorage и состоянии
    const updateLocalStorage = (value: T) => {
        localStorage.setItem(key, JSON.stringify(value));
        setStoredValue(value);
    };

    return [storedValue, updateLocalStorage] as const;
};

export default useLocalStorage;
