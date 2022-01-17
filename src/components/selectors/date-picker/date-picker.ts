
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DatePipe } from '@angular/common'

/** @title Basic datepicker */
@Component({
    selector: 'date-picker',
    templateUrl: 'date-picker.html',
    styleUrls: [
        'date-picker.scss',
    ]
})
export class DatePicker {

    @Input() public item: string;
    @Input() public dateType: string;
    @Input() public label: string = "Choose a date";
    @Input() public dateFormat: string;
    @Input() public locale: string = 'es';
    @Input() public isDisable: boolean = false;
    @Output() public itemChanged: EventEmitter<any> = new EventEmitter();

    public date: any;
    public datepipe: DatePipe = new DatePipe(this.locale);

    ngOnInit() {
        if (this.item) {
            this.date = new Date(this.item);
        }

    }

    ngOnChange() {
    }

    public setDate(data){
        console.log("Im in setDate",data);
        this.date = new Date(data.value);
        this.itemChanged.emit(this.date)
    }

 

}