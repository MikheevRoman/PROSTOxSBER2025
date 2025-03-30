import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import './EventList.css';
import {UUID} from "node:crypto";
import EventEntity from "../../../model/EventEntity";
import { useTelegramAuth } from '../../../context/TelegramAuthContext';
import {deleteEvent, getEvents} from "../../../api/endpoints/eventEndpoints";

const EventList = () => {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useTelegramAuth();

  const loadEvents = async () => {
    if (!user) {
      setError('Данные пользователя отсутствуют');
      setLoading(false);
      return;
    }

    // setLoading(true);
    setError(null);

    let eventsList: EventEntity[] = [];
    try {
      eventsList = await getEvents(user.id);
      setEvents(eventsList);
    }
    catch (error) {
      console.log(error);
      setError('Ошибка при загрузке мероприятий');
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Загрузка списка мероприятий
    if (user) {
      loadEvents().catch((error) => console.log(error));
    }
  }, [user]);

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleEventClick = (eventId: UUID) => {
    navigate(`/event/${eventId}`);
  };

  const handleDeleteEvent = async (clickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>, eventId: UUID) => {
    clickEvent.stopPropagation();
    if (!user) return;

    const confirmDelete = window.confirm("Вы уверены, что хотите удалить это мероприятие? Отменить действие будет невозможно.");
    if (!confirmDelete) return;

    try {
      await deleteEvent(eventId);
      await loadEvents();
    } catch (error) {
      console.error('Ошибка при удалении мероприятия', error);
    }
  }

  function isCurrentUserOrganizerOf(event: EventEntity): boolean {
    return event.organizerTgUserId === user.id;
  }

  const renderEventStatus = (event: EventEntity) => {
    return isCurrentUserOrganizerOf(event) ? 'Организатор' : 'Участник';
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

  if (loading) {
    return (
        <div className="event-list-container">
          <Header title="Мероприятия" />
          <div className="loading">Загрузка мероприятий...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="event-list-container">
          <Header title="Мероприятия" />
          <div className="error">{error}</div>
        </div>
    );
  }

  return (
    <div className="event-list-container">
      <Header 
        title="Мероприятия" 
        actionButton={
          <button className="button" onClick={handleCreateEvent}>
            Создать мероприятие
          </button>
        }
      />
      <div className="event-list">
        {!events || events.length === 0 ? (
          <div className="empty-state">
            <p>У вас пока нет мероприятий</p>
            <button className="button" onClick={handleCreateEvent}>
              Создать мероприятие
            </button>
          </div>
        ) : ( events &&
          events.map(event => (
            <div 
              key={event.id} 
              className="event-card card"
              onClick={() => handleEventClick(event.id)}
            >
              <h2 className="event-title">{event.name}</h2>
              <div className="event-details">
                <p className="event-date">
                  <span className="event-label">Дата:</span> {formatDate(event.date.toString())}
                </p>
                {event.place && (
                  <p className="event-location">
                    <span className="event-label">Место:</span> {event.place}
                  </p>
                )}
                <div className="event-status">
                  <span className={`status-badge ${isCurrentUserOrganizerOf(event) ? 'organizer' : 'participant'}`}>
                    {renderEventStatus(event)}
                  </span>
                </div>
                {
                  isCurrentUserOrganizerOf(event) && (
                    <button className="button" onClick={(e) => handleDeleteEvent(e, event.id)}>
                      Удалить
                    </button>
                  )
                }
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList; 