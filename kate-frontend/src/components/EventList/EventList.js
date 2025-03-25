import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EventList.css';

const EventList = ({ events }) => {
  const navigate = useNavigate();
  const currentUser = 'currentUser'; // В реальности будет ID текущего пользователя из авторизации

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const getUserRole = (event) => {
    const isOrganizer = event.organizerId === currentUser;
    return {
      text: isOrganizer ? 'Организатор' : 'Участник',
      className: isOrganizer ? 'organizer' : 'participant'
    };
  };

  return (
    <div className="event-list-container">
      <header className="event-list-header">
        <h1>Мои мероприятия</h1>
        <button 
          className="btn create-event-btn" 
          onClick={handleCreateEvent}
        >
          Создать мероприятие
        </button>
      </header>

      <div className="events-grid">
        {events.length > 0 ? (
          events.map(event => {
            const role = getUserRole(event);
            return (
              <div 
                key={event.id} 
                className="event-card card" 
                onClick={() => handleEventClick(event.id)}
              >
                <div className={`event-role ${role.className}`}>{role.text}</div>
                <h2 className="event-title">{event.title}</h2>
                <div className="event-details">
                  <div className="event-date">
                    <span className="event-icon">📅</span> {event.date}
                  </div>
                  <div className="event-location">
                    <span className="event-icon">📍</span> {event.location}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-events">
            <p>У вас пока нет мероприятий</p>
            <p>Нажмите "Создать мероприятие", чтобы начать</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList; 