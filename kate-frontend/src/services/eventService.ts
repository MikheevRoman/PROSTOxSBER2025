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
 * Получение всех мероприятий
 * @returns {Array} Массив объектов мероприятий
 */
export async function getEvents(): Promise<EventEntity[]> {
  return axios.get(API_BASE_URL).then(response => response.data);
}

/**
 * Получение мероприятия по ID
 * @returns {Array} Массив объектов мероприятий
 * @param eventId UUID мероприятия
 */
export async function getEventById(eventId: UUID): Promise<EventEntity | null> {
  return axios.get(API_BASE_URL + "/" + eventId.toString()).then(response => response.data);
}

// Создание нового мероприятия
export async function createEvent(eventData: EventEntity): Promise<EventEntity | ApiErrorResponse> {
  const newEvent = {
    name: eventData.name
  };

  return axios.post(API_BASE_URL, newEvent)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
      });
}

/**
 * Удаление мероприятия по ID
 * @returns {Array} Массив объектов мероприятий
 * @param eventId UUID мероприятия
 */
export async function deleteEvent(eventId: UUID)  {
  return axios.delete(API_BASE_URL + "/" + eventId.toString()).then(response => response.data);
}

// Обновление мероприятия
export const updateEvent = async (eventId: UUID, eventData: EventEntity) => {
  const events = await getEvents();
  const updatedEvents = events.map(event => 
    event.id === eventId ? { ...event, ...eventData } : event
  );
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
  return getEventById(eventId);
};

// Добавление покупки
export const addPurchase = async (eventId: UUID, purchaseData: any) => {
  const events = await getEvents();
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
export const updatePurchase = async (eventId: UUID, purchaseId: any, purchaseData: any) => {
  const events = await getEvents();
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

// Удаление покупки
export const deletePurchase = async (eventId: UUID, purchaseId: any) => {
  const events = await getEvents();
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
export const addParticipant = async (eventId: UUID, participantId: UUID) => {
  const events = await getEvents();
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
export const removeParticipant = async (eventId: UUID, participantId: UUID) => {
  const events = await getEvents();
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
export const assignNewOrganizer = async (eventId: UUID, newOrganizerId: UUID) => {
  const events = await getEvents();
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