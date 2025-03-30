import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import TelegramUser from '../model/TelegramUser';
import { useTelegram } from "../hooks/useTelegram";

interface TelegramAuthContextType {
    user: TelegramUser | null;
    tg: {
        ready: () => void;
        expand: () => void;
    } | null;
}

const TelegramAuthContext = createContext<TelegramAuthContextType>({ user: null, tg: null });

/**
 * Провайдер контекста аутентификации Telegram
 * @component TelegramAuthProvider
 * @param {Object} props - Свойства компонента
 * @param {ReactNode} props.children - Дочерние компоненты
 * @returns {JSX.Element} Компонент-провайдер контекста
 *
 * @example
 * // Пример использования:
 * <TelegramAuthProvider>
 *   <App />
 * </TelegramAuthProvider>
 */
export const TelegramAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Состояние для хранения данных пользователя
    const { tg } = useTelegram();
    // Сохраняем пользователя в localStorage
    const [user, setUser] = useState<TelegramUser | null>(() => {
        const storedUser = localStorage.getItem("telegram_user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        // Для разработки - можно установить мок через localStorage
        if (!(tg?.initDataUnsafe?.user) && process.env.NODE_ENV === 'development') {
            const mockUser = localStorage.getItem('debug:telegram_user');
            if (mockUser) {
                const parsedMockUser = JSON.parse(mockUser);
                setUser(parsedMockUser);
                localStorage.setItem("telegram_user", JSON.stringify(parsedMockUser)); // <-- Добавляем запись
                return;
            }
        }

        if (tg?.initDataUnsafe?.user) {
            console.log('Telegram user:', tg.initDataUnsafe.user);
            const userData = {
                id: tg.initDataUnsafe.user.id,
                first_name: tg.initDataUnsafe.user.first_name,
                last_name: tg.initDataUnsafe.user.last_name,
                username: tg.initDataUnsafe.user.username,
                photo_url: tg.initDataUnsafe.user.photo_url,
                auth_date: tg.initDataUnsafe.auth_date,
                hash: tg.initDataUnsafe.hash
            };
            const storedUser = localStorage.getItem("telegram_user");
            if (!storedUser || JSON.stringify(userData) !== storedUser) {
                console.log("Обновление данных Telegram пользователя", userData);
                setUser(userData);
                localStorage.setItem("telegram_user", JSON.stringify(userData));
            }
        }
    }, [tg]);

    return (
        // Предоставляем значение контекста дочерним компонентам
        <TelegramAuthContext.Provider value={{ user, tg }}>
            {children}
        </TelegramAuthContext.Provider>
    );
};

/**
 * Кастомный хук для доступа к контексту аутентификации Telegram
 * @function useTelegramAuth
 * @returns {TelegramAuthContextType} Объект с данными пользователя
 *
 * @example
 * // Пример использования в компоненте:
 * const { user } = useTelegramAuth();
 * console.log(user?.id);
 */
export const useTelegramAuth = (): TelegramAuthContextType => useContext(TelegramAuthContext);