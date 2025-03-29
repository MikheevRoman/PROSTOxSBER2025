// Импортируем необходимые зависимости
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Основные стили приложения

// Импортируем компоненты страниц
import EventList from './components/pages/EventList/EventList';
import CreateEvent from './components/pages/CreateEvent/CreateEvent';
import EventDetails from './components/pages/EventDetails/EventDetails';
import EditEvent from './components/pages/EditEvent/EditEvent';
import AddPurchase from './components/pages/Purchases/AddPurchase';

// Импортируем кастомные хуки и провайдеры контекста
import { useTelegram } from './hooks/useTelegram';
import { TelegramAuthProvider } from './context/TelegramAuthContext';

/**
 * Главный компонент приложения.
 * Использует React.FC (Function Component) для типизации компонента.
 */
const App: React.FC = () => {
  // Получаем объект Telegram WebApp с помощью кастомного хука
  const { tg } = useTelegram();

  // Эффект для инициализации Telegram WebApp
  useEffect(() => {
    // Вызываем методы ready() и expand() при монтировании компонента
    // Оператор ?. (optional chaining) проверяет существование tg
    tg?.ready(); // Сообщаем Telegram, что приложение готово к работе
    tg?.expand(); // Разворачиваем приложение на весь экран
  }, [tg]); // Зависимость от tg - эффект сработает при изменении tg

  return (
      /**
       * Оборачиваем приложение в провайдер контекста Telegram аутентификации.
       * Это позволит всем дочерним компонентам получать данные пользователя Telegram.
       */
      <TelegramAuthProvider>
        {/*
       * Router обеспечивает клиентскую маршрутизацию в приложении.
       * BrowserRouter использует HTML5 history API.
       */}
        <Router>
          {/* Основной контейнер приложения */}
          <div className="app-container">
            {/*
           * Routes - контейнер для всех маршрутов приложения.
           * Определяет какой компонент отображать в зависимости от URL.
           */}
            <Routes>
              {/*
             * Основные маршруты приложения:
             * - / - главная страница со списком событий
             * - /create-event - страница создания нового события
             * - /event/:eventId - страница деталей события
             * - /event/:eventId/edit - страница редактирования события
             * - /event/:eventId/add-purchase - страница добавления покупки
             * - /event/:eventId/edit-purchase/:purchaseId - страница редактирования покупки
             */}
              <Route path="/" element={<EventList />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/event/:eventId" element={<EventDetails />} />
              <Route path="/event/:eventId/edit" element={<EditEvent />} />
              <Route path="/event/:eventId/add-purchase" element={<AddPurchase />} />
              <Route path="/event/:eventId/edit-purchase/:purchaseId" element={<AddPurchase />} />
            </Routes>
          </div>
        </Router>
      </TelegramAuthProvider>
  );
}

// Экспортируем компонент App по умолчанию
export default App;