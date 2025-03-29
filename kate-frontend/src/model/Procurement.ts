import {UUID} from "node:crypto";

interface Procurement {
    id: string; // uuid
    name: string;
    price: number; // int
    comment: string;
    responsible: string; // uuid of responsible person
    completionStatus: CompletionStatus;
    contributors: UUID[]; // List<Participant>
    fundraisingStatus: FundraisingStatus;
}

export default Procurement;

export enum CompletionStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}

export enum FundraisingStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    FUNDED = "FUNDED",
    FAILED = "FAILED"
}