import baseApi from "../client";
import { UUID } from "node:crypto";

/**
 * Отправка уведомления пользователю в Telegram по его tgUserId
 * @param tgUserId ID пользователя в Telegram
 * @param message Сообщение для отправки
 * @returns {Promise<void>}
 */
export async function sendNotificationToUser(tgUserId: number, message: string): Promise<void> {
  return baseApi.post(`/company-events/notifications/send/user/${tgUserId}`, { messageText: message })
      .then(() => console.log(`Уведомление отправлено пользователю с tgUserId: ${tgUserId}`))
      .catch(error => {
        console.error(`Ошибка отправки уведомления пользователю ${tgUserId}:`, error);
        throw error;
      });
}

/**
 * Отправка уведомления участнику мероприятия по его ID
 * @param participantId ID участника мероприятия
 * @param message Сообщение для отправки
 * @returns {Promise<void>}
 */
export async function sendNotificationToParticipant(participantId: UUID, message: string): Promise<void> {
  return baseApi.post(`/company-events/notifications/send/participant/${participantId}`, { messageText: message })
      .then(() => console.log(`Уведомление отправлено участнику с ID: ${participantId}`))
      .catch(error => {
        console.error(`Ошибка отправки уведомления участнику ${participantId}:`, error);
        throw error;
      });
}
