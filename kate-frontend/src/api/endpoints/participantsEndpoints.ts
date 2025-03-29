import baseApi from "../../api/client";
import ApiErrorResponse from "../../model/ApiErrorResponse";
import Participant from "../../model/Participant";

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