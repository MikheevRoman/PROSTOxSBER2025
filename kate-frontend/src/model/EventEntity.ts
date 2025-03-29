import { UUID } from "node:crypto";
import Purchase from "./Purchase";

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

    // ?????
    purchases: Purchase[],
}

export default EventEntity;