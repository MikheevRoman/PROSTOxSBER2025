import {UUID} from "node:crypto";
import {CompletionStatus, FundraisingStatus} from "./Purchase";

interface PurchaseFormData {
    name: string;
    price: number; // int
    comment: string;
    completionStatus: CompletionStatus;
    contributors: UUID[]; // List<Participant>
    fundraisingStatus: FundraisingStatus;
}

export default PurchaseFormData;