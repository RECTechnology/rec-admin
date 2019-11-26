import { DocumentKind } from './document_kind.ent';

export interface Tier {
    code: string;
    description: string;
    id?: string | number;
    document_kinds?: DocumentKind[];
    document_kinds_id?: number[];

    previous_id?: number | string;
    previous?: Tier;
    next?: Tier;
    next_id?: number | string;
}

export class Tier implements Tier {
    constructor(txInfo?: Tier) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
            if (prop === 'previous') {
                this.previous_id = this.previous.id;
            }
            if (prop === 'next') {
                this.next_id = this.next.id;
            }
        }
    }
}
