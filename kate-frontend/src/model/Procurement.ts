import {UUID} from "node:crypto";

interface Procurement {
    id: UUID;
    name: string;
    price: number;
    comment: string;
    responsibleId: UUID;
    completionStatus: CompletionStatus;
    contributors: UUID[];
    fundraisingStatus: FundraisingStatus;
}

interface ShortProcurement {
    id: UUID;
    name: string;
    price: number;
    comment: string;
}

export default Procurement;

export enum CompletionStatus {
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}

export enum FundraisingStatus {
    NONE = "NONE",
    IN_PROGRESS = "PLANNING",
    DONE = "DONE"
}