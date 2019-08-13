import { Component } from '@angular/core';

@Component({
    selector: 'tab-neighborhoods',
    templateUrl: './neighborhoods.html',
})
export class NeighborhoodsTabComponent {
    public neighborhoods = [
        { id: 1, esp: 'Gracia', cat: 'Gracia', eng: 'Gracia', pending: true },
        { id: 2, esp: 'Eixample', cat: 'Eixample', eng: 'Eixample', pending: true },
    ];

    public editNeighborhoods($event) { }

    public addNeighborhood() { }

    public deleteNeighborhood($event) { }
}
