import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CountryPickerService } from 'ngx-country-picker';

@Component({
    selector: 'country-selector',
    styles: [
        `:host{ display: block;width: 100%; }`,
    ],
    templateUrl: './country-selector.html',
})
export class CountrySelector implements OnInit {
    public countries: any[];
    public error: string;
    @Input() public value: any = '';
    @Output() public valueChange = new EventEmitter<string>();

    constructor(
        protected countryPicker: CountryPickerService,
    ) { }

    public ngOnInit() {
        this.value = this.value;
        this.countryPicker.getCountries().subscribe((countries) => {
            this.countries = countries.sort((a) => {
                if (a.cca3 === 'ESP') { return -1; }
                return 0;
            });
        }, (err) => {
            this.error = err;
        });
    }
}
