import React, { useState, useEffect, useRef, useCallback } from 'react';

declare global {
    interface Window {
        ymaps: any;
    }
}

const YandexSuggestInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isMapsLoaded, setIsMapsLoaded] = useState(false);
    const API_KEY = '174f2ef9-0596-4f81-ba10-80589ec5b8fa';
    const suggestViewRef = useRef<any>(null);

    const initSuggest = useCallback(() => {
        if (!window.ymaps || !inputRef.current) return;

        try {
            setTimeout(() => {
                const popup = document.querySelector('.ymaps-suggest-popup') as HTMLElement;
            }, 100);


            suggestViewRef.current = new window.ymaps.SuggestView(inputRef.current, {
                results: 5,
                boundedBy: [[55.55, 37.42], [55.95, 37.82]]
            });

            suggestViewRef.current.events.add('select', (e: any) => {
                const selectedAddress = e.get('item').value;
                onChange(selectedAddress);
            });

        } catch (error) {
            console.error('Ошибка инициализации подсказок:', error);
        }
    }, [onChange]);

    useEffect(() => {
        const loadYandexMaps = () => {
            if (window.ymaps) {
                window.ymaps.ready(initSuggest);
                setIsMapsLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=9346f310-d786-4085-b396-97dca6243c98&suggest_apikey=174f2ef9-0596-4f81-ba10-80589ec5b8fa&lang=ru_RU&load=package.full`;
            script.async = true;

            script.onload = () => {
                window.ymaps.ready(() => {
                    setIsMapsLoaded(true);
                    initSuggest();
                });
            };

            script.onerror = (error) => {
                console.error('Ошибка загрузки Яндекс.Карт:', error);
            };

            document.head.appendChild(script);
        };

        loadYandexMaps();

        return () => {
            if (suggestViewRef.current) {
                suggestViewRef.current.destroy();
            }
        };
    }, [initSuggest]);

    return (
        <div className="suggest-container">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Укажите место проведения"
                autoComplete="off"
                className="yandex-suggest-input"
            />
            {!isMapsLoaded && (
                <div className="maps-loading">Загрузка сервиса подсказок...</div>
            )}
        </div>
    );
};

export default YandexSuggestInput;