import { Account } from './account.ent';
import { DocumentKind } from './document_kind.ent';

export interface Document {
    name: string;
    id?: string | number;
    status?: string;
    content?: string;
    account?: Account | number;
    account_id?: number;
    documents?: Document[];
    kind?: DocumentKind;
    kind_id?: number;
}

export class Document implements Document {
    constructor(txInfo?: Document) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
        }
    }
}
