
import {Component, EventEmitter, Input, Output} from '@angular/core';
import { DatePipe } from '@angular/common'

/** @title Basic datepicker */
@Component({
    selector: 'date-picker',
    templateUrl: 'date-picker.html',
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
    public last_date:any;
    
    ngOnInit(){
        this.date=new Date(this.item);
        this.last_date =this.datepipe.transform(this.date, this.dateFormat);
    }

    ngOnChange(){
    }

    public valueChange(){
        this.itemChanged.emit(this.last_date)
    }

}