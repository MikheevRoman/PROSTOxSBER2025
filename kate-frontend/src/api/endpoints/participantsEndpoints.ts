import baseApi from "../../api/client";
import ApiErrorResponse from "../../model/ApiErrorResponse";
import Participant from "../../model/Participant";
import {UUID} from "node:crypto";
import {getEventById} from "./eventEndpoints";

/**
 * Добавление участника мероприятия
 * @param participantData Данные участника
 * @returns {Promise<Participant | ApiErrorResponse>}
 */
export async function addParticipant(participantData: Participant): Promise<Participant | ApiErrorResponse> {
    return baseApi.post(`/company-events/participants`, participantData)
        .then(response => response.data)
        .catch(error => {
            console.error("Error adding participant:", error);
            return error.response?.data as ApiErrorResponse || { error: "Unknown error" };
        });
}

/**
 * Получение списка участников мероприятия
 * @param eventId ID мероприятия
 * @returns {Promise<Participant[] | ApiErrorResponse>}
 */
export async function getEventParticipants(eventId: string): Promise<Participant[] | ApiErrorResponse> {
    return baseApi.get(`/company-events/events/${eventId}/participants`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching event participants:", error);
            return error.response?.data as ApiErrorResponse || { error: "Unknown error" };
        });
}

/**
 * Получение participantId по tgUserId и eventId
 * @param tgUserId ID пользователя в Telegram
 * @param eventId ID мероприятия
 * @returns {Promise<string | ApiErrorResponse>}
 */
export async function getParticipantByUserIdAndEventId(tgUserId: number, eventId: string): Promise<string | ApiErrorResponse> {
    return baseApi.get(`/company-events/participants/search`, { params: { tgUserId, eventId } })
        .then(response => response.data.id) // ЗДЕСЬ БЕРЕМ `id`, А НЕ `participantId`
        .catch(error => {
            console.error("Error fetching participant ID:", error);
            return error.response?.data as ApiErrorResponse || { error: "Unknown error" };
        });
}

/**
 * Обновление данных участника по его ID
 * @param participantId ID участника
 * @param updateData Данные для обновления
 * @returns {Promise<Participant | ApiErrorResponse>}
 */
export async function updateParticipantById(
    participantId: string,
    updateData: { hasPayment: boolean }
): Promise<Participant | ApiErrorResponse> {
  return baseApi.patch(`/company-events/participants/${participantId}`, updateData)
      .then(response => response.data)
      .catch(error => {
        console.error(`Ошибка обновления данных участника с ID: ${participantId}`, error);
        return error.response?.data as ApiErrorResponse || { error: "Unknown error" };
      });
}

export async function deleteParticipantById(participantId: UUID): Promise<void> {
    return baseApi.delete(`/company-events/participants/${participantId}`);
}

export async function changeEventOrganizer(userId: number, eventId: UUID, newOrganizerId: number): Promise<Participant | ApiErrorResponse> {
    let event = await getEventById(userId, eventId);
    event.organizerTgUserId = newOrganizerId;

    return baseApi.patch(`/company-events/events/${eventId}`, event)
        .then(response => response.data)
        .catch(error => {
            console.error("Error changing event organizer:", error);
            return error.response?.data as ApiErrorResponse || { error: "Unknown error" };
        });
}


