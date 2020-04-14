// tslint:disable-next-line: no-empty-interface
export interface Order {
    id: string;
    created: string;
    updated: string;
    status: 'created' | 'in-progress' | 'expired' | 'done' | 'refunded';
    ip_address: string;
    payment_address: string;
    amount: string | number;
    reference: string;
    concept: string;

    ko_url: string;
    ok_url: string;
    access_key: string;
    signature: string;
    signature_version: string;
}

export class Order implements Order {
    public static STATUS_CREATED: string = 'created';
    public static STATUS_IN_PROGRESS: string = 'in-progress';
    public static STATUS_EXPIRED: string = 'expired';
    public static STATUS_DONE: string = 'done';
    public static STATUS_REFUNDED: string = 'refunded';

    constructor(txInfo?: Order) {
        for (const prop in txInfo) {
            if (prop) {
                this[prop] = txInfo[prop];
            }
        }
    }
}
