import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { getEvents } from '../../services/eventService';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Загрузка списка мероприятий
    const loadEvents = async () => {
      const eventsList = await getEvents();
      setEvents(eventsList);
    };

    loadEvents();
  }, []);

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const renderEventStatus = (event) => {
    return event.isOrganizer ? 'Организатор' : 'Участник';
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
        ) : (
          events.map(event => (
            <div 
              key={event.id} 
              className="event-card card"
              onClick={() => handleEventClick(event.id)}
            >
              <h2 className="event-title">{event.name}</h2>
              <div className="event-details">
                <p className="event-date">
                  <span className="event-label">Дата:</span> {formatDate(event.date)}
                </p>
                {event.location && (
                  <p className="event-location">
                    <span className="event-label">Место:</span> {event.location}
                  </p>
                )}
                <div className="event-status">
                  <span className={`status-badge ${event.isOrganizer ? 'organizer' : 'participant'}`}>
                    {renderEventStatus(event)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList; 