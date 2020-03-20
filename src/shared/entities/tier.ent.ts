import { DocumentKind } from './document_kind.ent';

export interface Tier {
    code: string;
    description: string;
    id?: string | number;
    document_kinds?: DocumentKind[];
    document_kinds_id?: number[];

    parent_id?: number | string;
    parent?: Tier;
    validated?: boolean;
}

export class Tier implements Tier {
    constructor(txInfo?: Tier) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
            if (prop === 'parent') {
                this.parent_id = this.parent.id;
            }
        }
    }
}
