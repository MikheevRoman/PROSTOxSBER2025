import React, { useState, useEffect, useRef, useCallback } from 'react';

declare global {
    interface Window {
        ymaps: any;
    }
}

const API_KEY_JS = '9346f310-d786-4085-b396-97dca6243c98';
const API_KEY = '174f2ef9-0596-4f81-ba10-80589ec5b8fa';

const YandexSuggestInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isMapsLoaded, setIsMapsLoaded] = useState(false);
    const suggestViewRef = useRef<any>(null);
    const mapsScriptRef = useRef<HTMLScriptElement | null>(null);

    const cleanupSuggestView = useCallback(() => {
        if (suggestViewRef.current) {
            try {
                suggestViewRef.current.destroy();
                suggestViewRef.current = null;
            } catch (error) {
                console.error('Error cleaning up SuggestView:', error);
            }
        }
    }, []);

    const initSuggest = useCallback(() => {
        if (!window.ymaps || !inputRef.current) return;

        cleanupSuggestView(); // Clean up any existing instance

        try {
            suggestViewRef.current = new window.ymaps.SuggestView(inputRef.current, {
                boundedBy: [[55.55, 37.42], [55.95, 37.82]],
                results: 5
            });

            suggestViewRef.current.events.add('select', (e: any) => {
                const selectedAddress = e.get('item').value;
                onChange(selectedAddress);
            });

        } catch (error) {
            console.error('Ошибка инициализации подсказок:', error);
        }
    }, [onChange, cleanupSuggestView]);

    useEffect(() => {
        const loadYandexMaps = () => {
            if (window.ymaps) {
                window.ymaps.ready(initSuggest);
                setIsMapsLoaded(true);
                return;
            }

            // Remove any existing script first
            if (mapsScriptRef.current) {
                document.head.removeChild(mapsScriptRef.current);
            }

            const script = document.createElement('script');
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY_JS}&suggest_apikey=${API_KEY}&lang=ru_RU&load=package.full`;
            script.async = true;
            mapsScriptRef.current = script;

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
            cleanupSuggestView();

            // Clean up the script if component unmounts
            if (mapsScriptRef.current) {
                document.head.removeChild(mapsScriptRef.current);
                mapsScriptRef.current = null;
            }
        };
    }, [initSuggest, cleanupSuggestView]);

    // Reinitialize suggest view when input ref changes
    useEffect(() => {
        if (isMapsLoaded && inputRef.current) {
            initSuggest();
        }
    }, [isMapsLoaded, initSuggest]);

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