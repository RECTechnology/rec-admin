import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'status-with-time',
    templateUrl: './status_with_time.html',
    styleUrls: ['./status-with-time.scss']
})
export class StatusWithTimeComponent implements OnInit, OnChanges {

    @Input() public start_time: string;
    @Input() public finish_time: string;
    @Input() public activeColor: string;
    @Input() public createdColor: string;
    @Input() public finishedColor: string;

    public init_time: number;
    public end_time: number;
    public created: boolean = false;
    public active: boolean = false;
    public finished: boolean = false;
    
    constructor() { }

    ngOnInit(): void {
        this.init_time = this.getTime(this.start_time);
        this.end_time = this.getTime(this.finish_time);
        this.getStatus(this.init_time, this.end_time);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.start_time){
            this.init_time = this.getTime(changes.start_time.currentValue);
        }
        if(changes.finish_time){
            this.end_time = this.getTime(changes.finish_time.currentValue);
        }
        this.getStatus(this.init_time, this.end_time);
    }

    public getTime(date: string){
        var dateItem = new Date(date);
        return dateItem.getTime();
    }

    public getStatus(init_time: number, end_time: number){
        let timeNow = Date.now();
        
        if(init_time >  timeNow){
            this.created = true;
            this.active = false;
            this.finished = false;
        }
        if(timeNow > init_time && timeNow < end_time){
            this.created = false;
            this.active = true;
            this.finished = false;
        }
        if(timeNow > end_time){
            this.created = false;
            this.active = false;
            this.finished = true;
        }
    }


}