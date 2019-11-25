import { Account } from './account.ent';
import { DocumentKind } from './document_kind.ent';

export interface Document {
    name: string;
    id?: string | number;
    status?: string;
    content?: string;
    account?: Account;
    account_id?: number;
    documents?: Document[];
    kind?: DocumentKind;
    kind_id?: string | number;
}

export class Document implements Document {

    public static STATUS_CREATED = 'created';
    public static STATUS_UPLOADED = 'uploaded';
    public static STATUS_SUBMITTED = 'submitted';
    public static STATUS_DECLINED = 'declined';
    public static STATUS_APROVED = 'aproved';
    public static STATUS_ARCHIVED = 'archived';

    public static ALL_STATUSES = [
        Document.STATUS_CREATED,
        Document.STATUS_APROVED,
        Document.STATUS_UPLOADED,
        Document.STATUS_SUBMITTED,
        Document.STATUS_DECLINED,
        Document.STATUS_ARCHIVED,
    ];

    constructor(txInfo?: Document) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
        }
    }
}
