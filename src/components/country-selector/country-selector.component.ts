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
    @Input() public value: any = 'ESP';
    @Output() public valueChange = new EventEmitter<string>();

    constructor(
        protected countryPicker: CountryPickerService,
    ) { }

    public ngOnInit() {
        this.value = this.value || 'ESP';
        console.log(this.value);

        this.countryPicker.getCountries().subscribe((countries) => {
            this.countries = countries;
            console.log('this.countries', countries);
        }, (err) => {
            this.error = err;
        });
    }
}
