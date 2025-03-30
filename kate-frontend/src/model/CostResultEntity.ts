import {UUID} from "node:crypto";

/**
 * Тип, представляющий результат стоимости мероприятия
 */
export interface CostResultEntity {
    participantId: UUID;
    name: string;
    spentAmount: number;
    owedAmount: number;
    totalAmount: number;
    notificationMessage: string;
}

export default CostResultEntity;