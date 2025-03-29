import { useEffect, useState } from 'react';

/**
 * Интерфейс, описывающий структуру Telegram WebApp API
 * @interface TelegramWebApp
 * @property {() => void} ready - Метод для уведомления Telegram о готовности приложения
 * @property {() => void} expand - Метод для разворачивания приложения на весь экран
 * @property {Object} [initDataUnsafe] - Опциональные данные инициализации
 * @property {Object} [initDataUnsafe.user] - Данные пользователя Telegram
 * @property {number} initDataUnsafe.user.id - Уникальный идентификатор пользователя
 * @property {string} [initDataUnsafe.user.first_name] - Имя пользователя
 * @property {string} [initDataUnsafe.user.last_name] - Фамилия пользователя
 * @property {string} [initDataUnsafe.user.username] - Никнейм пользователя
 * @property {string} [initDataUnsafe.user.photo_url] - URL аватара пользователя
 * @property {number} [initDataUnsafe.auth_date] - Время авторизации
 * @property {string} [initDataUnsafe.hash] - Хэш для проверки данных
 */
interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    initDataUnsafe?: {
        user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
        };
        auth_date?: number;
        hash?: string;
    };
}

// Расширяем глобальный интерфейс Window для TypeScript
declare global {
    interface Window {
        /**
         * Глобальный объект Telegram WebApp, доступный в Mini Apps
         * @type {Object|undefined}
         * @property {TelegramWebApp} WebApp - Основной API Telegram WebApp
         */
        Telegram?: {
            WebApp: TelegramWebApp;
        };
    }
}

/**
 * Кастомный хук для работы с Telegram WebApp API
 * @function useTelegram
 * @returns {Object} Объект с API Telegram WebApp
 * @returns {TelegramWebApp|null} .tg - Экземпляр Telegram WebApp или null, если не инициализирован
 * @example
 * // Пример использования в компоненте:
 * const { tg } = useTelegram();
 *
 * useEffect(() => {
 *   if (tg) {
 *     tg.ready();
 *     console.log('User ID:', tg.initDataUnsafe?.user?.id);
 *   }
 * }, [tg]);
 */
export const useTelegram = () => {
    // Состояние для хранения экземпляра Telegram WebApp
    const [tg, setTg] = useState<TelegramWebApp | null>(null);

    useEffect(() => {
        /**
         * Функция инициализации Telegram WebApp
         * @function initTelegram
         * @inner
         */
        const initTelegram = () => {
            try {
                // Проверяем наличие Telegram WebApp API в глобальном объекте window
                if (window.Telegram?.WebApp) {
                    setTg(window.Telegram.WebApp);
                } else {
                    console.warn('Telegram WebApp not available');
                    // Мок реализации для разработки вне Telegram
                    setTg({
                        ready: () => console.log('Telegram ready() mocked'),
                        expand: () => console.log('Telegram expand() mocked'),
                    });
                }
            } catch (e) {
                console.error('Telegram init error:', e);
            }
        };

        initTelegram();
    }, []);

    return { tg };
};