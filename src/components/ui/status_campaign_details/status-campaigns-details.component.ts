import { ThisReceiver } from "@angular/compiler";
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';


@Component({
    selector: 'status-campaigns-details',
    templateUrl: './status-campaigns-details.html'
})

export class StatusCampaignsDetailsComponent implements OnInit, OnChanges {

    @Input() status: string;
    @Input() bonusEnabled: boolean;
    @Input() endingAlert: boolean;

    
    public created: boolean = false;
    public active: boolean = false;
    public finished: boolean = false;


    constructor(){}

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.bonusEnabled){
            this.bonusEnabled = changes.bonusEnabled.currentValue;
        }
        if(changes.endingAlert){
            this.endingAlert = changes.endingAlert.currentValue;
        }
        if(changes.status){
            this.status = changes.status.currentValue
        } 
        this.getStatus(this.status); 
        console.log({
            status: this.status,
            bonusEnabled: this.bonusEnabled,

        });

    }

    ngOnInit(){
        this.getStatus(this.status);
    }

    public getStatus(status: string){
        
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