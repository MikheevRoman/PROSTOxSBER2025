import {UUID} from "node:crypto";

interface Purchase {
    id: UUID;
    name: string;
    price?: number; // marked optional with ? as it's noted "none"
}

export default Purchase;