import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'status-with-time',
    templateUrl: './status_with_time.html',
    styleUrls: ['./status-with-time.scss']
})
export class StatusWithTimeComponent implements OnInit, OnChanges {

    @Input() public status: string;
    @Input() public activeColor: string;
    @Input() public createdColor: string;
    @Input() public finishedColor: string;

    public created: boolean = false;
    public active: boolean = false;
    public finished: boolean = false;


    constructor() { }

    ngOnInit(): void {
        this.getStatus(this.status);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.status){
            this.status = changes.status.currentValue;
        }
        this.getStatus(this.status);
    }

    public getTime(date: string){
        var dateItem = new Date(date);
        return dateItem.getTime();
    }

    public getStatus(status: string){
        let timeNow = Date.now();
        
        if(status === 'created'){
            this.created = true;
            this.active = false;
            this.finished = false;
        }
        if(status === 'active'){
            this.created = false;
            this.active = true;
            this.finished = false;
        }
        if(status === 'finished'){
            this.created = false;
            this.active = false;
            this.finished = true;
        }
    }
}