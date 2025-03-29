import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosHeaders, RawAxiosRequestHeaders
} from 'axios';

import TelegramUser from '../model/TelegramUser';

import {useTelegramAuth} from "../context/TelegramAuthContext";


/**
 * Интерфейс расширенного Axios клиента
 */
interface ApiClient extends AxiosInstance {
    <T = any>(config: InternalAxiosRequestConfig): Promise<T>;
}

/**
 * Создаёт экземпляр axios с автоматической подстановкой Telegram-заголовков
 * @param {Function} [getUser] - Функция для получения пользователя (для использования в компонентах)
 */
const createApiClient = (getUser?: () => { user: TelegramUser | null }): ApiClient => {
    const instance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        // Получаем пользователя разными способами в зависимости от контекста
        let user: TelegramUser | null = null;

        // Способ 1: Из переданной функции (используется в компонентах)
        if (getUser) {
            user = getUser().user;
        }
        // 1. Пытаемся получить из Telegram WebApp
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
            user = {
                id: tgUser.id,
                first_name: tgUser.first_name,
                last_name: tgUser.last_name,
                username: tgUser.username,
                photo_url: tgUser.photo_url,
                auth_date: window.Telegram.WebApp.initDataUnsafe.auth_date,
                hash: window.Telegram.WebApp.initDataUnsafe.hash
            };
        }
        // 2. Для разработки - моковые данные
        else if (process.env.NODE_ENV === 'development') {
            user = {
                id: 123456789,
                first_name: 'Dev',
                last_name: 'User',
                auth_date: Math.floor(Date.now() / 1000),
                hash: 'dev-mock-hash'
            };
        }

        if (user) {
            // Создаём новый объект заголовков с правильным типом
            const headers = new AxiosHeaders({
                ...config.headers as RawAxiosRequestHeaders,
                'X-Telegram-User-ID': user.id.toString()
            });

            if (user.auth_date) {
                headers['X-Telegram-Auth-Date'] = user.auth_date.toString();
            }
            if (user.hash) {
                headers['X-Telegram-Hash'] = user.hash;
            }

            return {
                ...config,
                headers
            };
        }

        return config;
    });

    return instance;
};

// Базовый экземпляр для использования вне компонентов
const baseApi = createApiClient();

// Фабрика для создания экземпляра с доступом к контексту
export const useApiClientWithContext = () => {
    // Используем замыкание для доступа к контексту
    const { user } = useTelegramAuth();
    return createApiClient(() => ({ user }));
};

// Экспортируем базовый клиент
export default baseApi;