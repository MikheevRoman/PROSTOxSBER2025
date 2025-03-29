import { UUID } from "node:crypto";
import Procurement from "./Procurement";

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
    purchases: Procurement[],
}

export default EventEntity;