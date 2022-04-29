import { Component, SimpleChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Activity } from 'src/shared/entities/translatable/activity.ent';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
    selector: 'add-item',
    styleUrls: ['./add-item.scss'],
    templateUrl: './add-item.dia.html',
})
export class AddItemDia {
    public title: string = 'ADD_ITEM';
    public itemType: string = 'Item';
    public error: string;
    public loading: boolean = false;
    public disabled: boolean = false;
    public secondary_activity = null;
    public auxiliarItem:any;

    public actQuery = '';

    public isProduct = false;
    public isEdit = false;
    public edited = false;
    public activities = [];
    public formGroup = new FormGroup({
        name_ca: new FormControl(Validators.required),
        name_es: new FormControl(Validators.required),
        name: new FormControl(Validators.required),
        parent: new FormControl()
    })


    public item: any = {
        default_consuming_by: [],
        default_producing_by: [],
        name_ca: "",
        name_es:"",
        name: "",
        activity: Activity,
    };

    public itemCopy: any;

    public langMap = {
        cat: 'ca',
        en: 'en',
        es: 'es',
    };

    constructor(
        public dialogRef: MatDialogRef<AddItemDia>,
        public us: UserService,
        public translate: TranslateService,
        public activitiesCrud: ActivitiesCrud,
        public productsCrud: ProductsCrud,
        public alerts: AlertsService,
    ) {
        this.activitiesCrud.search({ offset: 0, limit: 100, sort: 'name', order: 'asc' }, this.langMap[this.us.lang])
            .subscribe((resp) =>this.setActivities(resp));
    }

    public ngOnInit() {
        this.formGroup.get('name').setValue(this.item.name);
        this.formGroup.get('name_ca').setValue(this.item.name_ca);
        this.formGroup.get('name_es').setValue(this.item.name_es);
        if(this.item.parent != null){
            this.secondary_activity = this.item.parent;
        }
        this.formGroup.get('parent').setValue(this.item.parent);
        this.check();
       this.validation();
    }

    public setActivities(resp:any){
       
        this.activities = resp.data.elements;
        this.ngOnChanges();
    }

    public ngOnChanges() {
      }

    public addedSubscriber(sub, message = 'ADDED_ACTIVITY') {
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

    public addConsumed(act) {
        this.loading = true;

        this.item.default_consuming_by.push(act);
        this.addedSubscriber(this.productsCrud.addConsumedByToProduct(this.item.id, act.id));
    }

    public addProduced(act) {
        this.loading = true;

        this.item.default_producing_by.push(act);
        this.addedSubscriber(this.productsCrud.addProducingByToProduct(this.item.id, act.id));
    }

    public deleteProduced(i) {
        this.loading = true;

        const act = this.item.default_producing_by[i];
        this.item.default_producing_by.splice(i, 1);
        this.deletedSubscriber(this.productsCrud.removeProducingByToProduct(this.item.id, act.id));
    }

    public deleteConsumed(i) {
        this.loading = true;

        const act = this.item.default_consuming_by[i];
        this.item.default_consuming_by.splice(i, 1);
        this.deletedSubscriber(this.productsCrud.removeConsumedByToProduct(this.item.id, act.id));
    }

    public validation(){
        this.itemCopy = {
          name: this.item.name,
          name_ca: this.item.name_ca,
          name_es: this.item.name_es,
        }
        const parent = this.item.parent;
        const initialValue = this.itemCopy;
        this.formGroup.valueChanges
          .pipe(
            debounceTime(100)
          )
          .subscribe(resp => {
              if(parent){
                this.edited = Object.keys(initialValue).some(key => resp[key] != 
                    initialValue[key]) || parent.id != resp.parent.id;
              }else {
                this.edited = Object.keys(initialValue).some(key => resp[key] != 
                    initialValue[key]) || parent != resp.parent;
              }
            
          })
         
      }
    public selectParentActivity(item) {
        this.item = item;
    
        // Aqui seteamos secondary_activity a null, para que tengan que volver a seleccionar una subactivity
        // Esto se hace porque cuando se selecciona un parent diferente, las subactivities son otras, por lo que tenemos que resetear el campo
        this.secondary_activity = null;
      }
      public selectActivity(item) {
        this.secondary_activity = item;
 
      }

    public add() {
        if( this.formGroup.invalid || this.loading || this.disabled || !this.formGroup.dirty || this.edited == false ){
            return;
        }
        if( this.secondary_activity !=null){
            this.item.parent_id = this.secondary_activity.id;
        }
        this.item.name = this.formGroup.get('name').value;
        this.item.name_ca = this.formGroup.get('name_ca').value;
        this.item.name_es = this.formGroup.get('name_es').value;

        this.item.name_ca = this.item.name_ca.trim();
        this.item.name_es = this.item.name_es.trim();
        this.item.name = this.item.name.trim();     
        this.dialogRef.close({ ...this.item });
    }


    public close(): void {
        this.dialogRef.close(false);
    }

    public nameMatches(name: string) {
        return String(name).toLowerCase().includes(this.actQuery.toLowerCase());
    }
    // TODO: revisar esto   
    public check() {
        // if (!this.item.esp || !this.item.eng || !this.item.cat) {
        //     const field: string = [
        //         !this.item.esp ? 'ESP' : '',
        //         !this.item.eng ? 'ENG' : '',
        //         !this.item.cat ? 'CAT' : '',
        //     ].filter((x) => x !== '').shift();
        //     this.error = this.translate.instant('INPUT_REQUIRED', {
        //         field: field ? this.translate.instant(field) : '',
        //     });
        //     this.disabled = true;
        // } else {
        //     this.error = '';
        //     this.disabled = false;
        // }
    }
}
