import { Document } from './document.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { Observable } from 'rxjs';
import { Tier } from './tier.ent';

export interface DocumentKind {
    id?: string | number;
    name?: string;
    description?: string;
    documents?: Document[];
    lemon_doctype?: string;
    tiers?: Tier[];
}

export class DocumentKind implements DocumentKind {
    constructor(txInfo?: DocumentKind) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
        }
    }
}
