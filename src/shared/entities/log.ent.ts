

export const LogTypes = <const>[
  'DEBUG',
  'WARNING',
  'ERROR',
];
export type LogType = typeof LogTypes[number];

export interface Log {
  id: string;
  type: LogType;
  log: string;
  date: string;
}

export class Log implements Log {
  public static ALL_TYPES = LogTypes;
  get raw () {
    return `${this.date} ${this.type}: ${this.log}`
  }

  constructor(txInfo?: Log) {
    // tslint:disable-next-line: forin
    for (const prop in txInfo) {
      this[prop] = txInfo[prop];
    }
  }
}
