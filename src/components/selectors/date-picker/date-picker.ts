
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

/** @title Basic datepicker */
@Component({
    selector: 'date-picker',
    templateUrl: 'date-picker.html',
    styleUrls: [
        'date-picker.scss',
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePicker),
            multi: true
        }
    ]
})
export class DatePicker {

    @Input() public item: string;
    @Input() public dateType: string;
    @Input() public label: string = "dd/mm/yyyy";
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

    writeValue(date: any): void {
        if(date){
            this.date = date;
        }
    }
    registerOnChange(fn: () => void): void {
    }
    registerOnTouched(fn: () => void): void {
    }

    public setDate(data){        
        this.date = new Date(data.value);
        this.itemChanged.emit(this.date)
    }
}