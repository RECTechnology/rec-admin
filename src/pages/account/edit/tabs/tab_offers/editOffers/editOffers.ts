import { Component, SimpleChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Activity } from 'src/shared/entities/translatable/activity.ent';
import { DatePipe } from '@angular/common';
import { empty } from 'rxjs';

@Component({
    selector: 'eddit-ofer',
    templateUrl: './editOffer.html',
})
export class EditOfferDia {
    public item: any;
    public loading: boolean = false;
    public disabled: boolean = false;
    public error: string;
    public isEdit = true;

    public types = ['percentage', 'classic', 'free'];
    public offer_image;
    constructor(
        public dialogRef: MatDialogRef<EditOfferDia>,
        public us: UserService,
        public translate: TranslateService,
        public activitiesCrud: ActivitiesCrud,
        public productsCrud: ProductsCrud,
        public alerts: AlertsService,
    ) { }

    public selectedType(event) {
        this.item.type = event;
    }

    public ngOnChanges() { }

    public changeDate(event) {
        var dateSupport: Date = new Date(event);
        var datepipe: DatePipe = new DatePipe('es');
        this.item.end = datepipe.transform(dateSupport, 'yyyy-MM-ddThh:mm:ss');
    }

    public deletedSubscriber(sub, message = 'Deleted activity') {
        sub.subscribe(
            (resp) => {
                this.alerts.showSnackbar(message, 'ok');
                this.loading = false;
            },
            (error) => {
                if (error.message === 'Conflict') {
                    error.message = 'ERROR_DUP';
                }
                this.alerts.showSnackbar(error.message, 'ok');
                this.loading = false;
            },
        );
    }

    public add() {
        if (this.checkData()) {
            this.dialogRef.close({ ...this.item });
        } else {
        }
    }



    public checkData() {
        return this.checkPercentageData() && this.checkClasicData() && this.checkDescDate() && this.checkEndDate();
    }

    public checkPercentageData() {
        if(this.item.type=='percentage'){
            if(this.item.discount != null ){
                return true;
            } else{
                this.alerts.showSnackbar('Need required data(Disscount)', 'ok');
                return false;
            }
        }else{
            return true;
        }
    }

    public checkClasicData() {
        if(this.item.type=='classic'){
            if(this.item.initial_price != null && this.item.offer_price != null ){
                return true;
            } else{
                this.alerts.showSnackbar('Need required data(initial or offer price)', 'ok');
                return false;
            }
        }else{
            return true;
        }
    
    }

  

    public checkEndDate() {
        if(this.item.end != null){
            return true
        }else{
            this.alerts.showSnackbar('Need required data(end date)', 'ok');
            return false

        }
    }

    public checkDescDate() {
       
        if(this.item.description != null && this.item.description != undefined){
            return true
        }else{
            this.alerts.showSnackbar('Need required data(description)', 'ok');
            return false

        }
        
    }

    public ngOnInit() { }

    public close(): void {
        this.dialogRef.close(false);
    }
}
