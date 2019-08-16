import { Component } from '@angular/core';
import { NeighborhoodsCrud } from 'src/services/crud/neighborhoods/neighborhoods.crud';
import { EntityTabBase } from '../base.tab';

@Component({
    selector: 'tab-neighborhoods',
    templateUrl: './neighborhoods.html',
})
export class NeighborhoodsTabComponent extends EntityTabBase {
    public neighborhoods = [
        { id: 1, esp: 'Gracia', cat: 'Gracia', eng: 'Gracia', pending: true },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample', pending: true },
    ];

    constructor(
        public nCrud: NeighborhoodsCrud,
    ) { super(); }

    public search() {
        this.nCrud.search({
            limit: this.limit,
            offset: this.offset,
            query: {
                search: this.query,
            },
        }).subscribe(
            (resp) => {
                console.log('neighborhoods', resp);
                this.neighborhoods = resp;
            },
            (error) => {
                console.log('errror', error);
            },
        );
    }

    public editNeighborhood($event) { }

    public addNeighborhood() { }

    public deleteNeighborhood($event) { }
}
