import { useEffect, useState } from 'react';

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

declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramWebApp;
        };
    }
}

export const useTelegram = () => {
    const [tg, setTg] = useState<TelegramWebApp | null>(null);

    useEffect(() => {
        const initTelegram = () => {
            try {
                // if (process.env.NODE_ENV === 'development' &&
                //     process.env.REACT_APP_ENABLE_TELEGRAM_MOCK === 'true') {
                //
                //     const mockUser = {
                //         id: 123456789,
                //         first_name: 'Dev',
                //         last_name: 'User'
                //     };
                //
                //     const mockTg = {
                //         ready: () => console.log('[MOCK] Telegram ready()'),
                //         expand: () => console.log('[MOCK] Telegram expand()'),
                //         initDataUnsafe: {
                //             user: mockUser,
                //             auth_date: Math.floor(Date.now() / 1000),
                //             hash: 'mock-hash'
                //         }
                //     };
                //
                //     setTg(mockTg);
                //     window.Telegram = { WebApp: mockTg };
                //     localStorage.setItem("telegram_webapp", JSON.stringify(mockTg)); // Сохраняем мок-объект
                //     return;
                // }

                if (window.Telegram?.WebApp) {
                    setTg(window.Telegram.WebApp);
                    localStorage.setItem("telegram_webapp", JSON.stringify(window.Telegram.WebApp)); // Кешируем
                } else {
                    console.warn('Telegram WebApp not available');
                    setTg({
                        ready: () => {},
                        expand: () => {}
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