import { Component } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';

@Component({
    selector: 'map',
    styleUrls: ['./map.css'],
    templateUrl: './map.html',
})
export class MapComponent {
    public title: string = 'My first AGM project';
    public lat: number = 51.678418;
    public lng: number = 7.809007;

    constructor(
        public controles: ControlesService
    ) { }
}
