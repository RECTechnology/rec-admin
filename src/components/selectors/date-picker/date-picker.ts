
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';

export class CustomDateAdapter extends NativeDateAdapter {

    parse(value: any): Date | null {

    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
       const str = value.split('/');

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  format(date: Date, displayFormat: Object): string {
    date = new Date(Date.UTC(
      date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
      date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
    displayFormat = Object.assign({}, displayFormat, { timeZone: 'utc' });

    const dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
    return dtf.format(date).replace(/[\u200e\u200f]/g, '');
  }

}
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
        },
        { provide: DateAdapter, useClass: CustomDateAdapter }
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
    onBlur(){
        if(this.onTouched){
            this.onTouched();
        }
       
    }
    onChange!:(item: any) => void;
    onTouched: any = () => {};
    writeValue(date: any): void {
        if(date){
            this.date = date;
        }
    }
    registerOnChange(fn: () => void): void {
        this.onChange = fn;  
    }
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDate(data){        
        this.date = new Date(data.value);
        this.itemChanged.emit(this.date)
        if(this.onChange){
            this.onChange(this.date)
        }
       
    }
}