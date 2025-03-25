import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EventDetails.css';

// Импорт компонентов вкладок
import PurchasesTab from './Tabs/PurchasesTab';
import MyContributionsTab from './Tabs/MyContributionsTab';
import MyTasksTab from './Tabs/MyTasksTab';
import ParticipantsTab from './Tabs/ParticipantsTab';
import SummaryTab from './Tabs/SummaryTab';

const EventDetails = ({ events, setEvents }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('purchases');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = 'currentUser'; // Заглушка, в реальности будет ID пользователя

  useEffect(() => {
    const foundEvent = events.find(e => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      // В реальном приложении могли бы загрузить с сервера
      navigate('/');
    }
    setLoading(false);
  }, [eventId, events, navigate]);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!event) {
    return <div className="error">Мероприятие не найдено</div>;
  }

  const isOrganizer = event.organizerId === currentUser;
  const userRole = isOrganizer ? 'Организатор' : 'Участник';

  // Обновление всего события в родительском состоянии
  const updateEvent = (updatedEvent) => {
    setEvent(updatedEvent);
    setEvents(prevEvents => prevEvents.map(e => 
      e.id === updatedEvent.id ? updatedEvent : e
    ));
  };

  // Обновление только списка закупок
  const updatePurchases = (purchases) => {
    const updatedEvent = { ...event, purchases };
    updateEvent(updatedEvent);
  };

  // Обновление списка участников
  const updateParticipants = (participants) => {
    const updatedEvent = { ...event, participants };
    updateEvent(updatedEvent);
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="event-details-container">
      <header className="event-header">
        <div className="event-header-top">
          <button className="back-button" onClick={goBack}>
            ← Назад
          </button>
          <h1 className="event-title">{event.title}</h1>
          <span className="user-role">{userRole}</span>
        </div>
        <div className="event-info">
          <div className="info-item">
            <span className="info-label">Дата:</span>
            <span className="info-value">{event.date}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Место:</span>
            <span className="info-value">{event.location}</span>
          </div>
          {event.budget && (
            <div className="info-item">
              <span className="info-label">Бюджет:</span>
              <span className="info-value">{event.budget} ₽</span>
            </div>
          )}
          {event.notes && (
            <div className="info-item">
              <span className="info-label">Примечание:</span>
              <span className="info-value">{event.notes}</span>
            </div>
          )}
        </div>
      </header>

      <div className="tabs-container">
        <div className="tabs">
          <div 
            className={`tab ${activeTab === 'purchases' ? 'active' : ''}`}
            onClick={() => setActiveTab('purchases')}
          >
            Закупки
          </div>
          <div 
            className={`tab ${activeTab === 'contributions' ? 'active' : ''}`}
            onClick={() => setActiveTab('contributions')}
          >
            Мои взносы
          </div>
          <div 
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Мои задачи
          </div>
          <div 
            className={`tab ${activeTab === 'participants' ? 'active' : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            Участники
          </div>
          {isOrganizer && (
            <div 
              className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              Итоги
            </div>
          )}
        </div>

        <div className="tab-content">
          {activeTab === 'purchases' && (
            <PurchasesTab 
              event={event} 
              updatePurchases={updatePurchases} 
              isOrganizer={isOrganizer}
              currentUser={currentUser}
            />
          )}
          {activeTab === 'contributions' && (
            <MyContributionsTab 
              event={event} 
              updatePurchases={updatePurchases}
              currentUser={currentUser}
            />
          )}
          {activeTab === 'tasks' && (
            <MyTasksTab 
              event={event} 
              updatePurchases={updatePurchases}
              currentUser={currentUser}
            />
          )}
          {activeTab === 'participants' && (
            <ParticipantsTab 
              event={event} 
              updateParticipants={updateParticipants}
              isOrganizer={isOrganizer}
              currentUser={currentUser}
            />
          )}
          {activeTab === 'summary' && isOrganizer && (
            <SummaryTab 
              event={event} 
              updateEvent={updateEvent}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 