import { Account } from "./account.ent";

export interface Badge {
    accounts: Account[],
    description: string,
    description_ca: string,
    description_es: string,
    enabled: boolean,
    id: number,
    image_url: string,
    name: string,
    name_ca: string,
    name_es: string

    
}

export class Badge implements Badge {
    constructor(txInfo?: Badge) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
        }
    }
}