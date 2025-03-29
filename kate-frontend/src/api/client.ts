import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useTelegramAuth } from '../context/TelegramAuthContext';

/**
 * Расширенный интерфейс AxiosInstance с уточнённой сигнатурой вызова
 * @interface ApiClient
 * @extends {AxiosInstance}
 */
interface ApiClient extends AxiosInstance {
    (config: InternalAxiosRequestConfig): Promise<any>;
}

/**
 * Фабрика для создания настроенного экземпляра axios-клиента
 * @function createApiClient
 * @returns {ApiClient} Настроенный экземпляр axios-клиента
 *
 * @description
 * Этот модуль создаёт предварительно настроенный HTTP-клиент для работы с API:
 * 1. Устанавливает базовый URL из переменных окружения
 * 2. Добавляет интерцептор для автоматической подстановки Telegram-аутентификации
 * 3. Предоставляет единую точку конфигурации для всех API-запросов
 *
 * @example
 * // Использование в компоненте или сервисе:
 * import api from './api/client';
 *
 * const fetchData = async () => {
 *   try {
 *     const response = await api.get('/endpoint');
 *     console.log(response.data);
 *   } catch (error) {
 *     console.error('API error:', error);
 *   }
 * };
 */
const createApiClient = (): ApiClient => {
    // Создаём базовый экземпляр axios с настройками
    const instance = axios.create({
        baseURL: process.env.REACT_APP_API_URL, // Базовый URL берётся из переменных окружения
    });

    // Добавляем интерцептор для модификации запросов
    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        // Получаем данные пользователя из контекста Telegram
        const { user } = useTelegramAuth();

        if (user) {
            // Инициализируем headers если они не существуют
            config.headers = config.headers || {};

            // Добавляем Telegram-аутентификацию в заголовки
            config.headers['X-Telegram-User-ID'] = user.id.toString();

            // Опциональные заголовки
            if (user.auth_date) {
                config.headers['X-Telegram-Auth-Date'] = user.auth_date.toString();
            }
            if (user.hash) {
                config.headers['X-Telegram-Hash'] = user.hash;
            }
        }
        return config;
    });

    return instance;
};

// Экспортируем функцию создания клиента (синглтон-паттерн)
export default createApiClient();