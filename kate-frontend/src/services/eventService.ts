import {v4} from "uuid";
import axios from "axios";
import {UUID} from "node:crypto";
import EventEntity from "../model/EventEntity";
import ApiErrorResponse from "../model/ApiErrorResponse";

// Сервис для работы с данными о мероприятиях
const EVENTS_KEY = 'kate_events';

// Путь к API. Должен быть без завершающего "/".
const API_BASE_URL = "https://prosto-sber-2025.gros.pro/api/company-events";

// Генерация уникального UUID
const generateId = () => v4();

/**
 * Получение мероприятий пользователя
 * @param userId ID пользователя Telegram
 * @returns {Promise<EventEntity[]>} Массив мероприятий
 */
export async function getEvents(userId: number): Promise<EventEntity[]> {
  return axios.get(`${API_BASE_URL}/users/${userId}/events`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching events:', error);
        throw error;
      });
}

/**
 * Получение конкретного мероприятия
 * @param userId ID пользователя Telegram
 * @param eventId UUID мероприятия
 * @returns {Promise<EventEntity | null>} Объект мероприятия или null
 */
export async function getEventById(userId: number, eventId: UUID): Promise<EventEntity | null> {
  return axios.get(`${API_BASE_URL}/events/${eventId}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching event:', error);
        return null;
      });
}


/**
 * Создание нового мероприятия
 * @param userId ID пользователя Telegram
 * @param eventData Данные мероприятия
 * @returns {Promise<EventEntity | ApiErrorResponse>}
 */
export async function createEvent(userId: number, eventData: EventEntity): Promise<EventEntity | ApiErrorResponse> {
  return axios.post(`${API_BASE_URL}/users/${userId}/events`, eventData)
      .then(response => response.data)
      .catch(error => {
        console.error('Error creating event:', error);
        return error.response?.data as ApiErrorResponse || { error: 'Unknown error' };
      });
}

/**
 * Удаление мероприятия
 * @param userId ID пользователя Telegram
 * @param eventId UUID мероприятия
 * @returns {Promise<void>}
 */
export async function deleteEvent(eventId: UUID): Promise<void> {
  return axios.delete(`${API_BASE_URL}/events/${eventId}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error deleting event:', error);
        throw error;
      });
}

/**
 * Обновление мероприятия
 * @param userId ID пользователя Telegram
 * @param eventId UUID мероприятия
 * @param eventData Новые данные мероприятия
 * @returns {Promise<EventEntity>}
 */
export const updateEvent = async (userId: number, eventId: UUID, eventData: EventEntity): Promise<EventEntity> => {
  return axios.put(`${API_BASE_URL}/users/${userId}/events/${eventId}`, eventData)
      .then(response => response.data)
      .catch(error => {
        console.error('Error updating event:', error);
        throw error;
      });
};

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

  // TODO: надо будет убрать
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
  return updatedPurchases.find(p => p.id === purchaseId);
};

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