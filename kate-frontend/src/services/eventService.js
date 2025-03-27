import {v4} from "uuid";
import axios from "axios";

// Сервис для работы с данными о мероприятиях
const EVENTS_KEY = 'kate_events';

const API_BASE_URL = "https://prosto-sber-2025.gros.pro/api/company-events/test";

// Генерация уникального ID
const generateId = () => {
  return v4();
};

// Получение всех мероприятий
export async function getEvents() {
  return axios.get(API_BASE_URL).then(response => response.data);
}

// Получение мероприятия по ID
export async function getEventById(eventId)  {
  return axios.get(API_BASE_URL + "/" + eventId.toString()).then(response => response.data);
}

// Создание нового мероприятия
export const createEvent = (eventData) => {
  const newEvent = {
    name: eventData
  }

  axios.post(API_BASE_URL, newEvent).then((response) =>
  {
    return response;
  }).catch((error) => {
    console.log(error);
  });
};

// Обновление мероприятия
export const updateEvent = (eventId, eventData) => {
  const events = getEvents();
  const updatedEvents = events.map(event => 
    event.id === eventId ? { ...event, ...eventData } : event
  );
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
  return getEventById(eventId);
};

// Добавление покупки
export const addPurchase = (eventId, purchaseData) => {
  const events = getEvents();
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
export const updatePurchase = (eventId, purchaseId, purchaseData) => {
  const events = getEvents();
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
export const deletePurchase = (eventId, purchaseId) => {
  const events = getEvents();
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
export const getEventInviteLink = (eventId) => {
  return `${window.location.origin}/event/${eventId}`;
};

// Добавление участника в мероприятие
export const addParticipant = (eventId, participantId) => {
  const events = getEvents();
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
export const removeParticipant = (eventId, participantId) => {
  const events = getEvents();
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
export const assignNewOrganizer = (eventId, newOrganizerId) => {
  const events = getEvents();
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