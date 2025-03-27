import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import Tabs from '../common/Tabs';
import { getEventById, getEventInviteLink } from '../../services/eventService';
import PurchasesTab from './Tabs/PurchasesTab';
import MyContributionsTab from './Tabs/MyContributionsTab';
import MyTasksTab from './Tabs/MyTasksTab';
import ParticipantsTab from './Tabs/ParticipantsTab';
import SummaryTab from './Tabs/SummaryTab';
import './EventDetails.css';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('purchases');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      const eventData = await getEventById(eventId);
      if (eventData) {
        setEvent(eventData);
      } else {
        // Если мероприятие не найдено, перенаправляем на главную
        navigate('/');
      }
      setLoading(false);
    };

    loadEvent();
  }, [eventId, navigate]);

  const handleEditEvent = () => {
    navigate(`/event/${eventId}/edit`);
  };

  const handleAddPurchase = () => {
    navigate(`/event/${eventId}/add-purchase`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTabs = () => {
    const tabs = [
      { id: 'purchases', label: 'Закупки' },
      { id: 'contributions', label: 'Мои взносы' },
      { id: 'tasks', label: 'Мои задачи' },
      { id: 'participants', label: 'Участники' },
    ];

    // Вкладка "Итоги" доступна только организатору
    if (event && event.isOrganizer) {
      tabs.push({ id: 'summary', label: 'Итоги' });
    }

    return tabs;
  };

  const renderTabContent = () => {
    if (!event) return null;

    switch (activeTab) {
      case 'purchases':
        return <PurchasesTab event={event} onAddPurchase={handleAddPurchase} />;
      case 'contributions':
        return <MyContributionsTab event={event} />;
      case 'tasks':
        return <MyTasksTab event={event} />;
      case 'participants':
        return <ParticipantsTab event={event} />;
      case 'summary':
        return event.isOrganizer ? <SummaryTab event={event} /> : null;
      default:
        return <PurchasesTab event={event} onAddPurchase={handleAddPurchase} />;
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!event) {
    return <div className="error">Мероприятие не найдено</div>;
  }

  return (
    <div className="event-details-container">
      <Header 
        title={event.name}
        showBackButton={true}
        actionButton={
          event.isOrganizer && (
            <button className="button secondary" onClick={handleEditEvent}>
              Редактировать
            </button>
          )
        }
      />

      <div className="event-summary">
        <div className="event-info">
          <p className="event-date">
            <span className="event-label">Дата:</span> {formatDate(event.date)}
          </p>
          {event.location && (
            <p className="event-location">
              <span className="event-label">Место:</span> {event.location}
            </p>
          )}
          {event.budget && (
            <p className="event-budget">
              <span className="event-label">Бюджет:</span> {event.budget} руб.
            </p>
          )}
          {event.note && (
            <p className="event-note">
              <span className="event-label">Примечание:</span> {event.note}
            </p>
          )}
          <p className="event-status">
            <span className={`status-badge ${event.isOrganizer ? 'organizer' : 'participant'}`}>
              {event.isOrganizer ? 'Организатор' : 'Участник'}
            </span>
          </p>
        </div>
      </div>

      <Tabs 
        tabs={getTabs()}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default EventDetails; 