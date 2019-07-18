import { Component } from '@angular/core';

@Component({
    selector: 'map',
    styleUrls: ['./map.css'],
    templateUrl: './map.html',
})
export class MapComponent {
    public title: string = 'My first AGM project';
    public lat: number = 51.678418;
    public lng: number = 7.809007;
}
