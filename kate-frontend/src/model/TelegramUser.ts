/**
 * Интерфейс, описывающий данные пользователя Telegram
 * @interface TelegramUser
 * @property {number} id - Уникальный идентификатор пользователя
 * @property {string} [first_name] - Имя пользователя (опционально)
 * @property {string} [last_name] - Фамилия пользователя (опционально)
 * @property {string} [username] - Никнейм пользователя (опционально)
 * @property {string} [photo_url] - URL аватара пользователя (опционально)
 * @property {number} [auth_date] - Временная метка авторизации (опционально)
 * @property {string} [hash] - Хэш для проверки данных (опционально)
 */
interface TelegramUser {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date?: number;
    hash?: string;
}

export default TelegramUser;