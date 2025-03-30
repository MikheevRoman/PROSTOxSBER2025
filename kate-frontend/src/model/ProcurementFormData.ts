import {UUID} from "node:crypto";
import {CompletionStatus, FundraisingStatus} from "./Procurement";

interface ProcurementFormData {
    name: string;
    price: number;
    comment: string;
    completionStatus: CompletionStatus;
    responsibleId?: UUID
    contributors: UUID[];
    fundraisingStatus: FundraisingStatus;
}

export default ProcurementFormData;