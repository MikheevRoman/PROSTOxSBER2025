import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

const CreateEvent = ({ onCreateEvent }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    budget: '',
    notes: ''
  });
  const [showNotification, setShowNotification] = useState(false);
  const [createdEvent, setCreatedEvent] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Убираем пустые строки из необязательных полей
    const eventData = {
      ...formData,
      budget: formData.budget.trim() || null,
      notes: formData.notes.trim() || null,
      createdAt: new Date().toISOString()
    };
    
    const newEvent = onCreateEvent(eventData);
    
    // Генерируем ссылку-приглашение
    const inviteLink = `${window.location.origin}/invite/${newEvent.id}`;
    
    setCreatedEvent({
      ...newEvent,
      inviteLink
    });
    
    setShowNotification(true);
  };

  const handleCopyLink = () => {
    if (createdEvent) {
      navigator.clipboard.writeText(createdEvent.inviteLink)
        .then(() => {
          alert('Ссылка скопирована!');
        })
        .catch(err => {
          console.error('Не удалось скопировать: ', err);
        });
    }
  };

  const closeNotification = () => {
    setShowNotification(false);
    navigate('/');
  };
  
  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="create-event-container">
      {!showNotification ? (
        <>
          <div className="create-event-header">
            <button className="back-button" onClick={goBack}>
              ← Назад
            </button>
            <h1>Создание мероприятия</h1>
          </div>
          <form className="create-event-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Название*</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Дата*</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Место*</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="budget">Бюджет (необязательно)</label>
              <input
                type="number"
                id="budget"
                name="budget"
                className="form-control"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Укажите общий бюджет мероприятия"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Примечание (необязательно)</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                rows="4"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Дополнительная информация о мероприятии"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={goBack}>
                Отмена
              </button>
              <button type="submit" className="btn btn-accent">
                Создать мероприятие
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="notification card">
          <h2>Мероприятие создано!</h2>
          <p>Вы стали организатором мероприятия <strong>{createdEvent?.title}</strong></p>
          
          <div className="invite-link-container">
            <p>Ссылка для приглашения участников:</p>
            <div className="invite-link-box">
              <input 
                type="text" 
                value={createdEvent?.inviteLink} 
                readOnly 
                className="form-control"
              />
              <button className="btn btn-info copy-link-btn" onClick={handleCopyLink}>
                Копировать
              </button>
            </div>
          </div>
          
          <button className="btn btn-accent" onClick={closeNotification}>
            Закрыть
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateEvent; 