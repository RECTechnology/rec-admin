import { TranslatableEntity } from "./base-translatable";
import { Activity } from "./activity.ent";

export class Product extends TranslatableEntity implements TranslatableEntity {
    public default_consuming_by: Activity[];
    public default_producing_by: Activity[];

    constructor(info?: Product) {
        super();
        for (let prop in info) {
            this[prop] = info[prop];
        }
    }
}