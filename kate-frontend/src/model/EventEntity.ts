import { UUID } from "node:crypto";
import Purchase from "./Purchase";

interface EventEntity {
    id: UUID,
    name: string,
    purchases: Purchase[],
    organizer: UUID,
    isOrganizer: boolean
    participants: UUID[]
}

export default EventEntity;