import { Account } from "./account.ent";
import { Badge } from "./badge.ent";

export interface Qualification {
    account: Account,
    badge: Badge,
    id: number,
    reviewer: Account,
    status: string,
    value: boolean
}

export class Qualification implements Qualification {
    constructor(txInfo?: Qualification) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
        }
    }
}