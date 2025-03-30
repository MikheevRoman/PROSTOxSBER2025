'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../common/Header';
import './EditEvent.css';
import EventFormData from "../../../model/EventFormData";
import {UUID} from "node:crypto";
import EventEntity from "../../../model/EventEntity";
import {useTelegramAuth} from "../../../context/TelegramAuthContext";
import {getEventById, updateEvent} from "../../../api/endpoints/eventEndpoints";
import {EventForm} from "../../forms/EventForm";
import ApiErrorResponse from "../../../model/ApiErrorResponse";

/**
 * Компонент страницы редактирования мероприятия
 */
const EditEvent = () => {
  const eventId: UUID = (useParams()).eventId as UUID;
  const navigate = useNavigate();
  const [initialFormData, setInitialFormData] = useState<EventFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useTelegramAuth();

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventData = await getEventById(user.id, eventId);

        if (eventData instanceof ApiErrorResponse || !eventData) {
          navigate('/');
          return;
        }

        setInitialFormData({
          name: eventData.name,
          date: eventData.date ? new Date(eventData.date).toISOString().slice(0, 16) : '',
          place: eventData.place,
          budget: eventData.budget,
          comment: eventData.comment,
        });
      } catch (error) {
        console.error('Error loading event:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, user.id, navigate]);

  const handleSubmit = async (e: React.FormEvent, formData: EventFormData) => {
    e.preventDefault();

    try {
      const updatedEvent: EventEntity = {
        id: eventId,
        createdAt: new Date(),
        eventRefCode: "",
        organizerCardInfo: "",
        organizerTgUserId: user.id,
        name: formData.name || "",
        date: formData.date ? new Date(formData.date) : new Date(),
        place: formData.place || "",
        budget: formData.budget || 0,
        comment: formData.comment
      };

      const result = await updateEvent(eventId, updatedEvent);

      if (result instanceof ApiErrorResponse) {
        console.error('Error updating event:', result);
        return;
      }

      navigate(`/event/${eventId}`);
    } catch (error) {
      console.error('Error:', error);
    }
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

        {initialFormData && (
            <EventForm
                initialData={initialFormData}
                onSubmit={handleSubmit}
            />
        )}
      </div>
  );
};

export default EditEvent;