import { User } from 'src/shared/entities/user.ent'
import { Account } from './account.ent';
import { DocumentKind } from './document_kind.ent';

export interface Document {
    name: string;
    id?: string | number;
    status?: string;
    user?: User;
    user_id?:number
    status_text?: string;
    content?: string;
    account?: Account;
    account_id?: number;
    documents?: Document[];
    kind?: DocumentKind;
    kind_id?: string | number;
    valid_until?: any;
    auto_fetched?: boolean;
}

export class Document implements Document {

    public static STATUS_CREATED = 'created';
    public static STATUS_UPLOADED = 'uploaded';
    public static STATUS_SUBMITTED = 'submitted';
    public static STATUS_DECLINED = 'declined';
    public static STATUS_APROVED = 'approved';
    public static STATUS_ARCHIVED = 'archived';
    

    public static REC_STATUS_SUBMITTED = 'rec_submitted';
    public static REC_STATUS_DECLINED = 'rec_declined';
    public static REC_STATUS_APROVED = 'rec_approved';
    public static REC_STATUS_EXPIRED = 'rec_expired';

    public static STATUS_ON_HOLD = 'on_hold';
    public static STATUS_NOT_VERIFIED = 'unverified';
    public static STATUS_NOT_READABLE = 'unreadable';
    public static STATUS_EXPIRED = 'expired';
    public static STATUS_REC_EXPIRED = 'rec_expired';
    public static STATUS_WRONG_TYPE = 'wrong_type';
    public static STATUS_WRONG_NAME = 'wrong_name';

    public static REC_STATUS_TYPES = [
        Document.REC_STATUS_SUBMITTED,
        Document.REC_STATUS_DECLINED,
        Document.REC_STATUS_APROVED,
        Document.REC_STATUS_EXPIRED,
    ];
    

    public static ALL_STATUSES = [
        Document.STATUS_CREATED,
        Document.STATUS_APROVED,
        Document.STATUS_UPLOADED,
        Document.STATUS_SUBMITTED,
        Document.STATUS_DECLINED,
        Document.REC_STATUS_SUBMITTED,
        Document.REC_STATUS_DECLINED,
        Document.REC_STATUS_APROVED,
        Document.STATUS_REC_EXPIRED,
        Document.STATUS_ARCHIVED,
        Document.STATUS_ON_HOLD,
        Document.STATUS_NOT_VERIFIED,
        Document.STATUS_NOT_READABLE,
        Document.STATUS_EXPIRED,
        Document.STATUS_WRONG_TYPE,
        Document.STATUS_WRONG_NAME,
    ];

    

    constructor(txInfo?: Document) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
        }
    }
}
