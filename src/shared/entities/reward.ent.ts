
export interface Reward {
    id: number;
    name: string;
    description: string;
    image: string;
    token_id: number;
    status: string;
    author_url: string;
    type?: string;
    challenge?: number;
}

export class Reward implements Reward {
    constructor(txInfo?: Reward) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
        }
    }
}