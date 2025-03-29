import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import Tabs from '../../common/Tabs';
import PurchasesTab from './Tabs/PurchasesTab';
import MyContributionsTab from './Tabs/MyContributionsTab';
import MyTasksTab from './Tabs/MyTasksTab';
import ParticipantsTab from './Tabs/ParticipantsTab';
import SummaryTab from './Tabs/SummaryTab';
import './EventDetails.css';
import {UUID} from "node:crypto";
import EventEntity from "../../../model/EventEntity";
import {useTelegramAuth} from "../../../context/TelegramAuthContext";
import {getEventById} from "../../../api/endpoints/eventEndpoints";

const EventDetails = () => {
  const eventId: UUID = (useParams()).eventId as UUID;
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventEntity | null>(null);
  const [activeTab, setActiveTab] = useState('purchases');
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useTelegramAuth();

  useEffect(() => {
    const loadEvent = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      const eventData = await getEventById(user.id, eventId);
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

  const formatDate = (dateString: string) => {
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
            <span className="event-label">Дата:</span> {formatDate(event.date.toString())}
          </p>
          {event.place && (
            <p className="event-location">
              <span className="event-label">Место:</span> {event.place}
            </p>
          )}
          {event.budget && (
            <p className="event-budget">
              <span className="event-label">Бюджет:</span> {event.budget} руб.
            </p>
          )}
          {event.comment && (
            <p className="event-note">
              <span className="event-label">Примечание:</span> {event.comment}
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