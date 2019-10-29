import { TranslatableEntity } from "./base-translatable";

export class Activity extends TranslatableEntity implements TranslatableEntity {
    constructor(info?: Activity) {
        super();
        for (let prop in info) {
            this[prop] = info[prop];
        }
    }
}