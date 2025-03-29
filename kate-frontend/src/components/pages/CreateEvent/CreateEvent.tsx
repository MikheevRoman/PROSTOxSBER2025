import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import { createEvent, getEventInviteLink } from '../../../services/eventService';
import './CreateEvent.css';
import EventFormData from "../../../model/EventFormData";
import EventEntity from "../../../model/EventEntity";
import ApiErrorResponse from '../../../model/ApiErrorResponse';
import {v4} from "uuid";
import {UUID} from "node:crypto";
import {useTelegramAuth} from "../../../context/TelegramAuthContext";

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
      isOrganizer: false,
      organizer: v4() as UUID, // TODO: REPLACE WITH TG ID
      organizerCardInfo: "",
      organizerTgUserId: 0,
      participants: [],
      purchases: [],
      id: v4() as UUID,
      name: formData?.name || "",
      date: formData?.date ? Date.parse(formData?.date) as unknown as Date : Date.prototype,
      place: formData?.place || "",
      budget: formData?.budget || 0,
      comment: formData?.comment
    }

    // const eventData = {
    //   title: formData.title,
    //   date: eventDate,
    //   location: formData.location || null,
    //   budget: formData.budget ? parseFloat(formData.budget) : null,
    //   note: formData.note || null,
    // };
    //
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

  const copyInviteLink = () => {
    if (!createdEvent) {
      return;
    }
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
                  {createdEvent && getEventInviteLink(createdEvent.id)}
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

          {/*<div className="form-group">*/}
          {/*  <label htmlFor="time">Время</label>*/}
          {/*  <input*/}
          {/*    type="time"*/}
          {/*    id="time"*/}
          {/*    name="time"*/}
          {/*    value={formData.time}*/}
          {/*    onChange={handleChange}*/}
          {/*  />*/}
          {/*</div>*/}

          <div className="form-group">
            <label htmlFor="location">Место</label>
            <input
              type="text"
              id="location"
              name="location"
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
            <label htmlFor="note">Примечание</label>
            <textarea
              id="note"
              name="note"
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