import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../common/Header';
import { getEventById, updateEvent } from '../../services/eventService';
import './EditEvent.css';

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    budget: '',
    note: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      const eventData = await getEventById(eventId);
      if (eventData) {
        // Разделение даты и времени
        let dateValue = '';
        let timeValue = '';
        
        if (eventData.date) {
          const dateObj = new Date(eventData.date);
          dateValue = dateObj.toISOString().split('T')[0];
          
          // Если в дате есть время
          if (eventData.date.includes('T')) {
            const timePart = eventData.date.split('T')[1];
            timeValue = timePart.substring(0, 5); // Формат HH:MM
          }
        }
        
        setFormData({
          title: eventData.title || '',
          date: dateValue,
          time: timeValue,
          location: eventData.location || '',
          budget: eventData.budget || '',
          note: eventData.note || ''
        });
      } else {
        // Если мероприятие не найдено, перенаправляем на главную
        navigate('/');
      }
      setLoading(false);
    };

    loadEvent();
  }, [eventId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
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
    
    updateEvent(eventId, eventData);
    navigate(`/event/${eventId}`);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="edit-event-container">
      <Header 
        title="Редактирование мероприятия" 
        showBackButton={true} 
      />

      <form className="edit-event-form" onSubmit={handleSubmit}>
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
            Сохранить изменения
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent; 