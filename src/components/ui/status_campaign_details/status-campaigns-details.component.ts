import { ThisReceiver } from "@angular/compiler";
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';


@Component({
    selector: 'status-campaigns-details',
    templateUrl: './status-campaigns-details.html'
})

export class StatusCampaignsDetailsComponent implements OnInit, OnChanges {

    @Input() endDate: string;
    @Input() initDate: string;
    @Input() bonusEnabled: boolean;
    @Input() endingAlert: boolean;

    public init_time: number;
    public end_time: number;
    public created: boolean = false;
    public active: boolean = false;
    public finished: boolean = false;


    constructor(){}

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.bonusEnabled){
            this.bonusEnabled = changes.bonusEnabled.currentValue;
        }
        if(changes.endingAlert){
            this.bonusEnabled = changes.endingAlert.currentValue;
        }
        if(changes.initDate){
            this.init_time = this.getTime(changes.initDate.currentValue);
        }
        if(changes.endDate){
            this.end_time = this.getTime(changes.endDate.currentValue);
        }
          this.getStatus(this.init_time, this.end_time);
    }

    ngOnInit(){
        this.init_time = this.getTime(this.initDate);
        this.end_time = this.getTime(this.endDate);
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