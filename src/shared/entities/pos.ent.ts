// tslint:disable-next-line: no-empty-interface
export interface Pos {
    notification_url: string;
    access_secret: string;
    access_token: string;
    active: boolean;
}

export class Pos implements Pos {
    constructor(txInfo?: Pos) {
        for (const prop in txInfo) {
            if (prop) {
                this[prop] = txInfo[prop];
            }
        }
    }
}
