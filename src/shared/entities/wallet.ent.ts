export interface Wallet {
    currency: string;
    balance: number;
    available: number;
}

export class Wallet implements Wallet {
    constructor(walletInfo?: Wallet) {
        // tslint:disable-next-line: forin
        for (const prop in walletInfo) {
            this[prop] = walletInfo[prop];
        }
    }
}
