import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { CountryPickerService } from 'angular2-countrypicker';

@Component({
    selector: 'country-selector',
    templateUrl: './country-selector.html',
})
export class CountrySelector implements OnInit {
    public countries: any[];
    public error: string;
    @Input() public value: any;
    @Output() public valueChange = new EventEmitter<string>();

    constructor(
        // public countryPickerService: CountryPickerService,
    ) { }

    public ngOnInit() {
        // this.countryPickerService.getCountries().subscribe((countries) => {
        //     this.countries = countries;
        // }, (err) => {
        //     this.error = err;
        // });
    }
}
