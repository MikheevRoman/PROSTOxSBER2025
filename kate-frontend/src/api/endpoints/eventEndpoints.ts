import { v4 } from "uuid";
import { UUID } from "node:crypto";
import baseApi from "../../api/client";
import EventEntity from "../../model/EventEntity";
import ApiErrorResponse from "../../model/ApiErrorResponse";

export async function getEvents(userId: number): Promise<EventEntity[]> {
    return baseApi.get(`/company-events/users/${userId}/events`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching events:", error);
            throw error;
        });
}

export async function getEventById(userId: number, eventId: UUID): Promise<EventEntity | null> {
    return baseApi.get(`/company-events/events/${eventId}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching event:", error);
            return null;
        });
}

export async function createEvent(userId: number, eventData: EventEntity): Promise<EventEntity | ApiErrorResponse> {
    return baseApi.post(`/company-events/users/${userId}/events`, eventData)
        .then(response => response.data)
        .catch(error => {
            console.error("Error creating event:", error);
            return error.response?.data as ApiErrorResponse || { error: "Unknown error" };
        });
}

export async function deleteEvent(eventId: UUID): Promise<void> {
    return baseApi.delete(`/company-events/events/${eventId}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error deleting event:", error);
            throw error;
        });
}

export async function updateEvent(userId: number, eventId: UUID, eventData: EventEntity): Promise<EventEntity> {
    return baseApi.put(`/company-events/users/${userId}/events/${eventId}`, eventData)
        .then(response => response.data)
        .catch(error => {
            console.error("Error updating event:", error);
            throw error;
        });
}
