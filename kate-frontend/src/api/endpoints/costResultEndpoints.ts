import baseApi from "../client";
import CostResultEntity from "../../model/CostResultEntity";
import {UUID} from "node:crypto";

/**
 * Получение результатов стоимости мероприятия
 * @param eventId ID мероприятия
 * @returns {Promise<CostResultEntity[]>} Массив результатов стоимости
 */
export async function getEventCostResults(eventId: UUID): Promise<CostResultEntity[]> {
    return baseApi.get(`/company-events/events/${eventId}/cost-results`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching event cost results:", error);
            throw error;
        });
}