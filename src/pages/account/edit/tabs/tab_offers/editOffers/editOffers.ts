import { Component, SimpleChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Activity } from 'src/shared/entities/translatable/activity.ent';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'eddit-ofer',
    templateUrl: './editOffer.html',
})
export class EditOfferDia {
   
    public item: any ;
    public loading:boolean = false;
    public disabled: boolean = false;
    public error: string;
    public types = [
        "percentage",
        "classic",
        "free"
    ];
    public offer_image;
    constructor(
        public dialogRef: MatDialogRef<EditOfferDia>,
        public us: UserService,
        public translate: TranslateService,
        public activitiesCrud: ActivitiesCrud,
        public productsCrud: ProductsCrud,
        public alerts: AlertsService,
    ) {
       
    }

    public selectedType(event){
        this.item.type = event;
    }

    public ngOnChanges() {
      }

    public addedSubscriber(sub, message = 'Added activity') {
        sub.subscribe(
            (resp) => {
                this.alerts.showSnackbar(message, 'ok');
                this.loading = false;
            },
            (error) => {
                this.alerts.showSnackbar(error.message, 'ok');
                if(error.message=="Duplicated resource (duplicated entry)"){
                    this.item.default_consuming_by.pop();
                }
                this.loading = false;
            });
    }

    public trackByFn(i, item) {
        return item.id;
      }

    
      public changeDate(event){
          var dateSupport :Date = new Date(event);
          var datepipe: DatePipe = new DatePipe('es');
          this.item.end = datepipe.transform(dateSupport, 'yyyy-MM-ddThh:mm:ss');;
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
            });
    } 

    public add() {
       
        this.dialogRef.close({ ...this.item });
    }

    public ngOnInit() {
    }
    

    public close(): void {
        this.dialogRef.close(false);
    }

    
   
}
