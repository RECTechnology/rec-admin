import { Document } from './document.ent';
import { Tier } from './tier.ent';

export interface RecStatusInterface {
    REC_STATUS?: String;
    REC_COLOR?: String;
}

export class RecStatus implements RecStatusInterface {
    constructor(public REC_STATUS?: String,
        public REC_COLOR?: String) {

    }
}
