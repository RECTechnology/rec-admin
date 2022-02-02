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
    selector: 'add-activity',
    templateUrl: './addActivity.html',
})
export class AddActivityDia {
    public main_activity_id: any;
    public item: any;
    public main_activity: any;
    public secondary_activity: any;
    public loading: boolean = false;
    public disabled: boolean = false;
    public error: string;
    public userId :String;

    constructor(
        public dialogRef: MatDialogRef<AddActivityDia>,
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


    public selectParentActivity(item) {
        this.main_activity = item;
        this.main_activity_id = this.main_activity ? this.main_activity.id : null;
        
       
        
       
        // Aqui seteamos secondary_activity a null, para que tengan que volver a seleccionar una subactivity
        // Esto se hace porque cuando se selecciona un parent diferente, las subactivities son otras, por lo que tenemos que resetear el campo
        this.secondary_activity = null;
        
      }
      public selectActivity(item) {
        this.secondary_activity = item;
        
      }
   

    public close() {
        this.dialogRef.close({ 
            main_activity: this.main_activity,
            main_activity_id: this.main_activity_id,
            secondary_activity: this.secondary_activity
         });
    }




    public ngOnInit() { }


}
