import baseApi from "../../api/client";
import ApiErrorResponse from "../../model/ApiErrorResponse";
import User from "../../model/Participant";

/**
 * Получение всех пользователей
 * @returns {Promise<User[]>} Массив пользователей
 */
export async function getUsers(): Promise<User[]> {
    return baseApi.get(`/company-events/users`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching users:", error);
            throw error;
        });
}

/**
 * Добавление нового пользователя
 * @param userData Данные пользователя
 * @returns {Promise<UserEntity | ApiErrorResponse>}
 */
export async function addUser(userData: User): Promise<User | ApiErrorResponse> {
    return baseApi.post(`/company-events/users`, userData)
        .then(response => response.data)
        .catch(error => {
            console.error("Error adding user:", error);
            return error.response?.data as ApiErrorResponse || { error: "Unknown error" };
        });
}

/**
 * Получение пользователя по ID
 * @param userId ID пользователя Telegram
 * @returns {Promise<User | null>} Объект пользователя или null
 */
export async function getUserById(userId: number): Promise<User | null> {
    return baseApi.get(`/company-events/users/${userId}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching user by ID:", error);
            return null;
        });
}

/**
 * Удаление пользователя по ID
 * @param userId ID пользователя Telegram
 * @returns {Promise<void>}
 */
export async function deleteUser(userId: number): Promise<void> {
    return baseApi.delete(`/company-events/users/${userId}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error deleting user:", error);
            throw error;
        });
}

/**
 * Обновление данных пользователя
 * @param userId ID пользователя Telegram
 * @param userData Новые данные пользователя
 * @returns {Promise<UserEntity>}
 */
export async function updateUser(userId: number, userData: User): Promise<User> {
    return baseApi.patch(`/company-events/users/${userId}`, userData)
        .then(response => response.data)
        .catch(error => {
            console.error("Error updating user:", error);
            throw error;
        });
}
