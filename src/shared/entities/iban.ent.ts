export interface Iban {
    number: string;
    holder: string;
    bank_name: string;
    bank_address: string;
    bic: string;
    name: string;
    id?: string;
}

export class Iban implements Iban {
    constructor(txInfo?: Iban) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
        }
    }
}
