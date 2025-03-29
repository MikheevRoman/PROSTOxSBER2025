import {v4} from "uuid";
import axios from "axios";
import {UUID} from "node:crypto";
import EventEntity from "../model/EventEntity";
import ApiErrorResponse from "../model/ApiErrorResponse";
import {getEvents} from "../api/endpoints/eventEndpoints";

// Сервис для работы с данными о мероприятиях
const EVENTS_KEY = 'kate_events';

// Путь к API. Должен быть без завершающего "/".
const API_BASE_URL = "https://prosto-sber-2025.gros.pro/api/company-events";

// Генерация уникального UUID
const generateId = () => v4();

// TODO: Использовать API вместо локального хранилища
// Добавление покупки
export const addPurchase = async (userId: number, eventId: UUID, purchaseData: any) => {
  const events = await getEvents(userId);
  const event = events.find(e => e.id === eventId);
  
  if (!event) return null;
  
  const newPurchase = {
    id: generateId(),
    ...purchaseData,
    createdAt: new Date().toISOString()
  };
  
  const updatedEvent = {
    ...event,
    purchases: [...event.purchases, newPurchase]
  };
  
  const updatedEvents = events.map(e => 
    e.id === eventId ? updatedEvent : e
  );
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
  return newPurchase;
};

// TODO: Использовать API вместо локального хранилища
// Обновление покупки
export const updatePurchase = async (
    userId: number,
    eventId: UUID,
    purchaseId: any,
    purchaseData: any
) => {
  const events = await getEvents(userId);
  const event = events.find(e => e.id === eventId);
  
  if (!event) return null;
  
  const updatedPurchases = event.purchases.map(purchase => 
    purchase.id === purchaseId ? { ...purchase, ...purchaseData } : purchase
  );
  
  const updatedEvent = {
    ...event,
    purchases: updatedPurchases
  };
  
  const updatedEvents = events.map(e => 
    e.id === eventId ? updatedEvent : e
  );

  localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
  return updatedPurchases.find(p => p.id === purchaseId);
};

// TODO: Использовать API вместо локального хранилища
// Удаление покупки
export const deletePurchase = async (
    userId: number,
    eventId: UUID,
    purchaseId: any) => {
  const events = await getEvents(userId);
  const event = events.find(e => e.id === eventId);
  
  if (!event) return false;
  
  const updatedPurchases = event.purchases.filter(p => p.id !== purchaseId);
  
  const updatedEvent = {
    ...event,
    purchases: updatedPurchases
  };
  
  const updatedEvents = events.map(e => 
    e.id === eventId ? updatedEvent : e
  );
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
  return true;
};

// TODO: Использовать API вместо локального хранилища
// Получение приглашения для мероприятия
export const getEventInviteLink = (eventId: UUID): string => {
  return `${window.location.origin}/event/${eventId}`;
};

// Добавление участника в мероприятие
export const addParticipant = async (
    userId: number,
    eventId: UUID,
    participantId: UUID) => {
  const events = await getEvents(userId);
  const event = events.find(e => e.id === eventId);
  
  if (!event) return false;
  
  // Проверка, не является ли пользователь уже участником
  if (event.participants.includes(participantId)) return true;
  
  const updatedEvent = {
    ...event,
    participants: [...event.participants, participantId]
  };
  
  const updatedEvents = events.map(e => 
    e.id === eventId ? updatedEvent : e
  );
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
  return true;
};

// TODO: Использовать API вместо локального хранилища
// Удаление участника из мероприятия
export const removeParticipant = async (
    userId: number,
    eventId: UUID,
    participantId: UUID) => {
  const events = await getEvents(userId);
  const event = events.find(e => e.id === eventId);
  
  if (!event) return false;
  
  // Организатора нельзя удалить
  if (event.organizer === participantId) return false;
  
  const updatedEvent = {
    ...event,
    participants: event.participants.filter(p => p !== participantId)
  };
  
  const updatedEvents = events.map(e => 
    e.id === eventId ? updatedEvent : e
  );
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
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
  if (!event.participants.includes(newOrganizerId)) return false;
  
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