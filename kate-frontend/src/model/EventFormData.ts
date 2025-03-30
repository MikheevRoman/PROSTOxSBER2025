import {UUID} from "node:crypto";

interface EventFormData {
    name?: string,
    date?: string,
    place?: string,
    budget?: number,
    comment?: string,
    organizerCardInfo?: string,
}

export default EventFormData;