import { Activity } from './activity.ent';

export interface Product {
    name?: string;
    [key: string]: any;
}
export class Product implements Product {
    public default_consuming_by?: Activity[];
    public default_producing_by?: Activity[];

    constructor(info?: Product) {
        // tslint:disable-next-line: forin
        for (const prop in info) {
            this[prop] = info[prop];
        }
    }
}
