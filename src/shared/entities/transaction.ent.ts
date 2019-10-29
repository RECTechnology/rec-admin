export interface Transaction {

}

export class Transaction implements Transaction {
    constructor(txInfo?: Transaction) {
        for (let prop in txInfo) {
            this[prop] = txInfo[prop];
        }
    }
}