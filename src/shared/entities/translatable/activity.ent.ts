export interface Activity {
    name?: string;
    [key: string]: any;
}

export class Activity implements Activity {
    constructor(info?: Activity) {
        // tslint:disable-next-line: forin
        for (const prop in info) {
            this[prop] = info[prop];
        }
    }
}
