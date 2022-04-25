import { AfterViewChecked, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { DatePipe } from '@angular/common';
import {  FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'eddit-ofer',
    templateUrl: './editOffer.html',
})
export class EditOfferDia implements AfterViewChecked, OnInit {
    public item: any;
    public loading: boolean = false;
    public disabled: boolean = false;
    public error: string;
    public isEdit = true;
    public typesNull = false;
    public initialPriceNull = false;
    public offerPriceNull = false;
    public endNull = false;
    public descriptionNull = false;
    public discountNull = false;
    public fg: FormGroup;
    public types = ['percentage', 'classic', 'free'];
    public offer_image;
    public formGroup = new FormGroup({
        description: new FormControl("",[Validators.required]),
        offer_price: new FormControl("",[Validators.required]),
        discount_percent: new FormControl("",[Validators.required]),
        initial_price: new FormControl("",[Validators.required]),
        end: new FormControl("",[Validators.required]),
        type: new FormControl("",[Validators.required]),
        active: new FormControl(),
        file: new FormControl()

    })
    constructor(
        public dialogRef: MatDialogRef<EditOfferDia>,
        public us: UserService,
        public translate: TranslateService,
        public activitiesCrud: ActivitiesCrud,
        public productsCrud: ProductsCrud,
        public alerts: AlertsService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
      }

    ngOnInit(): void {
        this.setControlValid();
        if(this.item.end){
            this.formGroup.get('end').setValue(this.item.end)
        }
        if(!this.isEdit){
            this.item.active = true;
        }
       
    }

    public selectedType(event) {
        this.item.type = event;
        if(this.item.type){
            this.setControlValid();
        }
       
    }

    public setControlValid(){
        if(this.item.type == 'classic'){
            this.formGroup.get('discount_percent').setErrors(null);
        }else if(this.item.type == 'percentage'){
            this.formGroup.get('initial_price').setErrors(null)
            this.formGroup.get('offer_price').setErrors(null)
        }else if(this.item.type == 'free'){
            this.formGroup.get('discount_percent').setErrors(null)
            this.formGroup.get('initial_price').setErrors(null)
            this.formGroup.get('offer_price').setErrors(null)
        }  
    }


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
        if(this.formGroup.invalid || !this.formGroup.dirty){
            return;
        }
        this.dialogRef.close({ ...this.item });
        
    }

    public close(): void {
        this.dialogRef.close(false);
    }
}
