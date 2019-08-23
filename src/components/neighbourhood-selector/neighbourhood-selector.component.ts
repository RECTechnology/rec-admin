import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CountryPickerService } from 'ngx-country-picker';
import { NeighborhoodsCrud } from 'src/services/crud/neighborhoods/neighborhoods.crud';

@Component({
    selector: 'neighbourhood-selector',
    styles: [
        `:host{ display: block;width: 100%; }`,
    ],
    templateUrl: './neighbourhood-selector.html',
})
export class NeighbourhoodSelector implements OnInit {
    public barrios: any[];
    public error: string;

    @Input() public value: any = '';
    @Input() public disabled: boolean = false;
    @Output() public valueChange = new EventEmitter<string>();

    constructor(
        protected nCrud: NeighborhoodsCrud,
    ) { }

    public ngOnInit() {
        this.search();
    }

    public search() {
        this.nCrud.list({ limit: 100 }).subscribe((resp) => {
            this.barrios = resp.data.elements;
            console.log('this.barrios', this.barrios);
        }, (err) => {
            this.error = err;
        });
    }
}
