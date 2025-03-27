import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { createEvent, getEventInviteLink } from '../../services/eventService';
import './CreateEvent.css';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    budget: '',
    note: ''
  });
  const [eventCreated, setEventCreated] = useState(false);
  const [createdEvent, setCreatedEvent] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Объединение даты и времени, если они указаны
    let eventDate = null;
    if (formData.date) {
      if (formData.time) {
        eventDate = `${formData.date}T${formData.time}`;
      } else {
        eventDate = formData.date;
      }
    }
    
    const eventData = {
      title: formData.title,
      date: eventDate,
      location: formData.location || null,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      note: formData.note || null,
    };
    
    const newEvent = await createEvent(eventData);
    setCreatedEvent(newEvent);
    setEventCreated(true);
  };

  const handleCloseNotification = () => {
    navigate('/');
  };

  const copyInviteLink = () => {
    const link = getEventInviteLink(createdEvent.id);
    navigator.clipboard.writeText(link)
      .then(() => {
        alert('Ссылка-приглашение скопирована в буфер обмена');
      })
      .catch(err => {
        console.error('Не удалось скопировать ссылку: ', err);
      });
  };

  return (
    <div className="create-event-container">
      <Header 
        title="Создание мероприятия" 
        showBackButton={true} 
      />

      {eventCreated ? (
        <div className="notification">
          <div className="notification-content">
            <h2>Мероприятие создано!</h2>
            <p>Вы назначены организатором этого мероприятия.</p>
            <div className="invite-link">
              <p>Пригласите участников по ссылке:</p>
              <div className="invite-link-action">
                <span className="invite-link-text">
                  {getEventInviteLink(createdEvent.id)}
                </span>
                <button className="button secondary" onClick={copyInviteLink}>
                  Копировать
                </button>
              </div>
            </div>
            <button className="button" onClick={handleCloseNotification}>
              Закрыть
            </button>
          </div>
        </div>
      ) : (
        <form className="create-event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Название мероприятия*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Введите название мероприятия"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Дата</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Время</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Место</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Укажите место проведения"
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget">Бюджет (руб.)</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Укажите бюджет мероприятия"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="note">Примечание</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Дополнительная информация"
              rows="3"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="button">
              Создать мероприятие
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateEvent; 