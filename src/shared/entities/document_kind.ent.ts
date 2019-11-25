import { Document } from './document.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { Observable } from 'rxjs';

export interface DocumentKind {
    id?: string | number;
    name?: string;
    description?: string;
    documents?: Document[];

    crud?: DocumentKindsCrud;
    setTier?: (id) => Observable<any>;
    unsetTier?: (id) => Observable<any>;
}

export class DocumentKind implements DocumentKind {
    constructor(txInfo?: DocumentKind, crud?: DocumentKindsCrud) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
        }

        this.crud = crud;
        this.setTier = this.crud.setTier.bind(this.crud, this.id);
        this.unsetTier = this.crud.unsetTier.bind(this.crud, this.id);
    }
}
