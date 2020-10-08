import { Account } from './account.ent';

export interface Campaign {
  id: string;
  created: string;
  updated: string;

  init_date: string;
  end_date: string;

  name: string;
  balance: number;
  accounts: Account[];
}

export class Campaign implements Campaign {
  constructor(txInfo?: Partial<Campaign>) {
    for (const prop in txInfo) {
      if (prop) {
        this[prop] = txInfo[prop];
      }
    }
  }

  get isFinished() {
    const currentDate = Date.now();
    const endDate = new Date(this.end_date).getTime();

    const isFinished = endDate <= currentDate;
    return isFinished;
  }
}
