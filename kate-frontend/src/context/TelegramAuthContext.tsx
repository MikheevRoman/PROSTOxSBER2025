import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import TelegramUser from '../model/TelegramUser';

/**
 * Интерфейс контекста аутентификации Telegram
 * @interface TelegramAuthContextType
 * @property {TelegramUser | null} user - Данные пользователя или null если не авторизован
 */
interface TelegramAuthContextType {
    user: TelegramUser | null;
}

/**
 * Создаем контекст для хранения данных аутентификации Telegram
 * @constant TelegramAuthContext
 * @type {React.Context<TelegramAuthContextType>}
 * @default { user: null } - Начальное значение контекста
 */
const TelegramAuthContext = createContext<TelegramAuthContextType>({ user: null });

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
    const [user, setUser] = useState<TelegramUser | null>(null);

    useEffect(() => {
        // Получаем объект Telegram WebApp из глобальной области видимости
        const tg = window.Telegram?.WebApp;

        // Если есть данные пользователя в initDataUnsafe
        if (tg?.initDataUnsafe?.user) {
            const userData = tg.initDataUnsafe.user;

            // Устанавливаем данные пользователя в состояние
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
    }, []); // Пустой массив зависимостей - эффект выполняется только при монтировании

    return (
        // Предоставляем значение контекста дочерним компонентам
        <TelegramAuthContext.Provider value={{ user }}>
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