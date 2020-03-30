// tslint:disable-next-line: no-empty-interface
export interface Transaction { }

export class Transaction implements Transaction {
    constructor(txInfo?: Transaction) {
        for (const prop in txInfo) {
            if (prop) {
                this[prop] = txInfo[prop];
            }
        }
    }
}
