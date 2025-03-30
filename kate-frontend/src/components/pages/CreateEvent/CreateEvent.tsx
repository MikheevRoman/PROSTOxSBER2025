'use client';

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
import {EventForm} from "../../forms/EventForm";

/**
 * Компонент страницы создания мероприятия
 */
const CreateEvent = () => {
  const [eventCreated, setEventCreated] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>('');
  const navigate = useNavigate();
  const { user } = useTelegramAuth();

  const handleSubmit = async (e: React.FormEvent, formData: EventFormData) => {
    e.preventDefault();
    console.log(formData);
    const eventFromForm: EventEntity = {
      createdAt: new Date(),
      eventRefCode: "",
      organizerCardInfo: "",
      organizerTgUserId: user.id,
      id: v4() as UUID,
      name: formData?.name,
      date: formData?.date ? new Date(formData?.date) : new Date(),
      place: formData?.place,
      budget: formData?.budget,
      comment: formData?.comment
    }

    try {
      const newEvent = await createEvent(user.id, eventFromForm);

      if (newEvent instanceof ApiErrorResponse) {
        console.error('Error creating event:', newEvent);
        return;
      }

      const link = await getEventInviteLink(user.id, newEvent.id);
      setInviteLink(link);
      setEventCreated(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseNotification = () => {
    navigate('/');
  };

  const copyInviteLink = () => {
    if (!inviteLink) return;

    navigator.clipboard.writeText(inviteLink)
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
                  {inviteLink}
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
            <EventForm initialData={null} onSubmit={handleSubmit} />
        )}
      </div>
  );
};

export default CreateEvent;