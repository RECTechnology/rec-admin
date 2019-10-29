export interface Neighborhood {

}

export class Neighborhood implements Neighborhood {
    constructor(neiInfo?: Neighborhood) {
        for (let prop in neiInfo) {
            this[prop] = neiInfo[prop];
        }
    }
}