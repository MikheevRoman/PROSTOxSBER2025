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
    const [user, setUser] = useState<TelegramUser | null>(null);

    useEffect(() => {
        // Для разработки - можно установить мок через localStorage
        if (process.env.NODE_ENV === 'development') {
            const mockUser = localStorage.getItem('debug:telegram_user');
            if (mockUser) {
                setUser(JSON.parse(mockUser));
                return;
            }
        }

        if (tg?.initDataUnsafe?.user) {
            console.log("tg updated:", tg);
            const userData = tg.initDataUnsafe.user;
            setUser({
                id: userData.id,
                first_name: userData.first_name,
                last_name: userData.last_name,
                username: userData.username,
                photo_url: userData.photo_url,
                auth_date: tg.initDataUnsafe.auth_date,
                hash: tg.initDataUnsafe.hash
            });
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