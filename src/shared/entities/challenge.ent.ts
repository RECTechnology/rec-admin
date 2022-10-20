import { Account } from "./account.ent";
import { Reward } from './reward.ent';
import { Activity } from './translatable/activity.ent';

export interface Challenge {
    id?: number;
    title?: string;
    description?: string;
    activities?: Activity[];
    action?: string;
    type?: string;
    threshold?: number;
    amount_required?: number;
    cover_image?: string;
    owner?: Account;
    owner_id?: number;
    token_reward_id?: number;
    token_reward?: Reward;
    status?: string;
    start_date?: string;
    finish_date?: string;
}

export class Challenge implements Challenge {
    constructor(txInfo?: Challenge) {
        // tslint:disable-next-line: forin
        for (const prop in txInfo) {
            this[prop] = txInfo[prop];
        }
    }
}