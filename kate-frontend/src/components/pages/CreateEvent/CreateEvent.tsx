import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import './CreateEvent.css';
import EventFormData from "../../../model/EventFormData";
import EventEntity from "../../../model/EventEntity";
import ApiErrorResponse from '../../../model/ApiErrorResponse';
import {v4} from "uuid";
import {UUID} from "node:crypto";
import {useTelegramAuth} from "../../../context/TelegramAuthContext";
import {createEvent, getEventInviteLink} from "../../../api/endpoints/eventEndpoints";

const CreateEvent = () => {
  const [formData, setFormData] = useState<EventFormData>();
  const [eventCreated, setEventCreated] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<EventEntity | null>(null);
  const navigate = useNavigate();
  const { user } = useTelegramAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventFromForm: EventEntity = {
      createdAt: Date.prototype,
      eventRefCode: "",
      organizerCardInfo: "",
      organizerTgUserId: user.id,
      id: v4() as UUID,
      name: formData?.name,
      date: formData?.date ? new Date(formData?.date) : Date.prototype,
      place: formData?.place,
      budget: formData?.budget,
      comment: formData?.comment
    }

    const newEvent: EventEntity | ApiErrorResponse = await createEvent(user.id, eventFromForm);

    if (!newEvent || newEvent instanceof ApiErrorResponse) {
      return;
    }

    setCreatedEvent(newEvent);
    setEventCreated(true);
  };

  const handleCloseNotification = () => {
    navigate('/');
  };

  const copyInviteLink = async () => {
    if (!createdEvent) {
      return;
    }
    const link = await getEventInviteLink(user.id, createdEvent.id);
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
                  {createdEvent && getEventInviteLink(user.id, createdEvent.id)}
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
            <label htmlFor="name">Название мероприятия</label>
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
              Создать мероприятие
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateEvent; 