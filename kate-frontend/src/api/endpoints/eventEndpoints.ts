import { v4 } from "uuid";
import { UUID } from "node:crypto";
import baseApi from "../../api/client";
import EventEntity from "../../model/EventEntity";
import ApiErrorResponse from "../../model/ApiErrorResponse";
import EventFormData from "../../model/EventFormData";

/**
 * Получение мероприятий пользователя
 * @param userId ID пользователя Telegram
 * @returns {Promise<EventEntity[]>} Массив мероприятий
 */
export async function getEvents(userId: number): Promise<EventEntity[]> {
    return baseApi.get(`/company-events/users/${userId}/events`)
        .then(response => response.data)
        .catch(error => {
            if (error.response?.status === 404) {
                return [];
            }
            console.error("Error fetching events:", error);
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
    return baseApi.get(`/company-events/events/${eventId}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching event:", error);
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
    // В payload дата форматируется как строка в формате ISO 8601 без миллисекунд.
    // Это необходимо для корректной обработки даты на стороне сервера.
    const payload = {...eventData, date: eventData.date.toISOString().replace(/\.\d{3}Z$/, 'Z')};

    return baseApi.post(`/company-events/users/${userId}/events`, payload)
        .then(response => response.data)
        .catch(error => {
            console.error("Error creating event:", error);
            return error.response?.data as ApiErrorResponse || { error: "Unknown error" };
        });
}

/**
 * Удаление мероприятия
 * @param userId ID пользователя Telegram
 * @param eventId UUID мероприятия
 * @returns {Promise<void>}
 */
export async function deleteEvent(eventId: UUID): Promise<void> {
    return baseApi.delete(`/company-events/events/${eventId}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error deleting event:", error);
            throw error;
        });
}

/**
 * Обновление мероприятия
 * @param eventId UUID мероприятия
 * @param eventData Новые данные мероприятия
 * @returns {Promise<EventEntity>}
 */
export async function updateEvent(eventId: UUID, eventData: EventEntity): Promise<EventEntity> {
    const eventUpdateDto: EventFormData = {
        name: eventData.name,
        date: new Date(eventData.date).toISOString().replace(/\.\d{3}Z$/, 'Z'),
        place: eventData.place,
        budget: eventData.budget,
        organizerCardInfo: eventData.organizerCardInfo,
        comment: eventData.comment
    };

    return baseApi.patch(`/company-events/events/${eventId}`, eventUpdateDto)
        .then(response => response.data)
        .catch(error => {
            console.error("Error updating event:", error);
            throw error;
        });
}

/**
 * Генерирует реферальную ссылку-приглашение для мероприятия в Telegram боте
 * @param {number} userId - Telegram ID пользователя
 * @param {UUID} eventId - UUID мероприятия
 * @returns {Promise<string>} Promise, который разрешается в Telegram-ссылку вида https://t.me/CompanyEventsBot?start={refCode}
 */
export const getEventInviteLink = async (userId: number, eventId: UUID): Promise<string> => {
    const eventRefCode = (await getEventById(userId, eventId)).eventRefCode;
    return `https://t.me/CompanyEventsBot?start=${eventRefCode}`;
};
