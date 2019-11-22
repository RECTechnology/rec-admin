import { Document } from './document.ent';

export interface DocumentKind {
    id?: string | number;
    name?: string;
    description?: string;
    documents?: Document[];
}

export class DocumentKind implements DocumentKind {
    constructor(txInfo?: DocumentKind) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
        }
    }
}
