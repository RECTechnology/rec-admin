// tslint:disable-next-line: no-empty-interface
export interface Neighborhood { }

export class Neighborhood implements Neighborhood {
    constructor(neiInfo?: Neighborhood) {
        for (const prop in neiInfo) {
            if (prop) {
                this[prop] = neiInfo[prop];
            }
        }
    }
}
