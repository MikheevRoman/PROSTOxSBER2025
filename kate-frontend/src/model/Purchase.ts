import {UUID} from "node:crypto";

interface Purchase {
    id: UUID;
    name: string;
    price?: number;
}

export default Purchase;