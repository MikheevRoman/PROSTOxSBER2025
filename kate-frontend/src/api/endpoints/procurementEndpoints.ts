import baseApi from "../../api/client";
import {UUID} from "node:crypto";
import ApiErrorResponse from "../../model/ApiErrorResponse";
import Procurement from "../../model/Procurement";

export async function getEventProcurements(eventId: UUID): Promise<Procurement[]> {
    return await baseApi.get(`company-events/events/${eventId}/procurements`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error adding participant:", error);
        });
}

export async function getAssignedProcurementsForParticipant(participantId: UUID): Promise<Procurement[]> {
    return await baseApi.get(`company-events/participant/${participantId}/procurements/responsible`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error adding participant:", error);
        });
}

export async function getProcurementById(procurementId: UUID): Promise<Procurement> {
    return await baseApi.get(`company-events/procurements/${procurementId}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error getting procurement:", error);
        });
}

export async function addProcurement(eventId: UUID, procurement: Procurement): Promise<Procurement> {
    return await baseApi.post(`company-events/events/${eventId}/procurements`, procurement)
        .then(response => response.data)
        .catch(error => {
            console.error("Error adding procurement:", error);
        });
}

export async function updateProcurement(eventId: UUID, procurementId: UUID, procurement: Procurement): Promise<Procurement> {
    return await baseApi.patch(`company-events/events/${eventId}/procurements/${procurementId}`, procurement)
        .then(response => response.data)
        .catch(error => {
            console.error("Error updating procurement:", error);
        });
}