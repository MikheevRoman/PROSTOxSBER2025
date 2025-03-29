import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../common/Header';
import './EditEvent.css';
import EventFormData from "../../../model/EventFormData";
import {UUID} from "node:crypto";
import EventEntity from "../../../model/EventEntity";
import {v4} from "uuid";
import {useTelegramAuth} from "../../../context/TelegramAuthContext";
import {getEventById, updateEvent} from "../../../api/endpoints/eventEndpoints";


const EditEvent = () => {
  const eventId: UUID = (useParams()).eventId as UUID;
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EventFormData>();
  const [loading, setLoading] = useState(true);
  const { user } = useTelegramAuth();

  useEffect(() => {
    const loadEvent = async () => {
      const eventData = await getEventById(user.id, eventId);

      if (eventData) {
        setFormData({
          name: eventData?.name,
          date: eventData?.date ? new Date(eventData.date).toISOString().slice(0, 16) : '',
          place: eventData?.place,
          budget: eventData?.budget,
          comment: eventData?.comment,
        });
      } else {
        // Если мероприятие не найдено, перенаправляем на главную
        navigate('/');
      }
      setLoading(false);
    };

    loadEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventFromForm: EventEntity = {
      createdAt: Date.prototype,
      eventRefCode: "",
      organizerCardInfo: "",
      organizerTgUserId: user.id,
      id: v4() as UUID,
      name: formData?.name || "",
      date: formData?.date ? new Date(formData?.date) : Date.prototype,
      place: formData?.place || "",
      budget: formData?.budget || 0,
      comment: formData?.comment
    }
    
    await updateEvent(eventId, eventFromForm);
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
          <label htmlFor="name">Название мероприятия*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData?.name}
            onChange={handleChange}
            required
            placeholder="Введите название мероприятия"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Дата и время</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData?.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="place">Место</label>
          <input
            type="text"
            id="place"
            name="place"
            value={formData?.place}
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
            value={formData?.budget}
            onChange={handleChange}
            placeholder="Укажите бюджет мероприятия"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="comment">Примечание</label>
          <textarea
            id="comment"
            name="comment"
            value={formData?.comment}
            onChange={handleChange}
            placeholder="Дополнительная информация"
            rows={3}
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