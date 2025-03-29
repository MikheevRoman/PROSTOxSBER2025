import {UUID} from "node:crypto";

interface Participant {
    id: UUID;
    name?: string;
    tgUserId?: number;
    createdAt?: string;
}

export default Participant;