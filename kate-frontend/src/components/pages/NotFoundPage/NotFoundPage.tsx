/**
 * Компонент страницы 404 (Страница не найдена).
 * Отображает сообщение об ошибке и кнопку возврата на главную страницу.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import './NotFoundPage.css';

/**
 * Компонент NotFoundPage.
 * @returns {JSX.Element} Страница 404 с заголовком и кнопкой возврата.
 */
const NotFoundPage = () => {
    const navigate = useNavigate();

    /**
     * Обработчик нажатия на кнопку "Вернуться на главную".
     * Перенаправляет пользователя на главную страницу.
     */
    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="not-found-container">
            <Header title="Ошибка 404" />
            <div className="not-found-content">
                <h2>Страница не найдена</h2>
                <p>Возможно, вы ошиблись в адресе или страница была удалена.</p>
                <button className="button" onClick={handleGoHome}>
                    Вернуться на главную
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
