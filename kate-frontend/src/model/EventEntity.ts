import { UUID } from "node:crypto";

interface EventEntity {
    id: UUID,
    name: string,
    date: Date,
    place: string,
    budget: number,
    comment?: string,
    organizerCardInfo: string,
    organizerTgUserId: number,
    eventRefCode: string,
    createdAt: Date
}

export default EventEntity;