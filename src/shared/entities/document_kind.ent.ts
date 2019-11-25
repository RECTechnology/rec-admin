import { Document } from './document.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { Observable } from 'rxjs';

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
