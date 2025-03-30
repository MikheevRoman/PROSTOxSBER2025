import {v4} from "uuid";
import axios from "axios";
import {UUID} from "node:crypto";
import EventEntity from "../model/EventEntity";
import ApiErrorResponse from "../model/ApiErrorResponse";
import {getEventById, getEvents} from "../api/endpoints/eventEndpoints";

// Сервис для работы с данными о мероприятиях
const EVENTS_KEY = 'kate_events';

// TODO: Использовать API вместо локального хранилища
// Удаление участника из мероприятия
export const removeParticipant = async (
    userId: number,
    eventId: UUID,
    participantId: number) => {
  const events = await getEvents(userId);
  const event = events.find(e => e.id === eventId);
  
  if (!event) return false;
  
  // Организатора нельзя удалить
  if (event.organizerTgUserId === participantId) return false;
  
  // const updatedEvent = {
  //   ...event,
  //   participants: event.participants.filter(p => p !== participantId)
  // };
  
  // const updatedEvents = events.map(e =>
  //   e.id === eventId ? updatedEvent : e
  // );
  
  // localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
  return true;
};

// TODO: Использовать API вместо локального хранилища
// Назначение нового организатора
export const assignNewOrganizer = async (
    userId: number,
    eventId: UUID,
    newOrganizerId: UUID
) => {
  const events = await getEvents(userId);
  const event = events.find(e => e.id === eventId);
  
  if (!event) return false;
  
  // Проверка, является ли пользователь участником
  // if (!event.participants.includes(newOrganizerId)) return false;
  
  const updatedEvent = {
    ...event,
    organizer: newOrganizerId
  };
  
  const updatedEvents = events.map(e => 
    e.id === eventId ? updatedEvent : e
  );
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
  return true;
}; 