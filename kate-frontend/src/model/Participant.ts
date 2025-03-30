import {UUID} from "node:crypto";

interface Participant {
    id: UUID;
    name?: string;
    hasPayment?: boolean;
    tgUserId?: number;
    createdAt?: string;
}

export default Participant;