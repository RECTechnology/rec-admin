import { AfterViewChecked, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { DatePipe } from '@angular/common';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
    selector: 'eddit-ofer',
    templateUrl: './editOffer.html',
})
export class EditOfferDia implements AfterViewChecked, OnInit {
    public item: any;
    public itemCopy: any;
    public loading: boolean = false;
    public disabled: boolean = false;
    public error: string;
    public isEdit = true;
    public edited = false;
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
        description: new FormControl("",Validators.required),
        offer_price: new FormControl(null,Validators.required),
        discount: new FormControl(null,Validators.required),
        initial_price: new FormControl(null,Validators.required),
        end: new FormControl(null,Validators.required),
        type: new FormControl("",Validators.required),
        active: new FormControl(true),
        image: new FormControl()       
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
        if(this.isEdit){
            if(this.item){
                this.formGroup.get('type').setValue(this.item.type),
                this.formGroup.get('description').setValue(this.item.description),
                this.formGroup.get('active').setValue(this.item.active),
                this.formGroup.get('offer_price').setValue(this.item.offer_price),
                this.formGroup.get('discount').setValue(this.item.discount),
                this.formGroup.get('initial_price').setValue(this.item.initial_price),
                this.formGroup.get('end').setValue(this.item.end),
                this.formGroup.get('image').setValue(this.item.image)
            }
        }
        if(!this.isEdit){
            this.item.active = true;
        }
        this.validation();
    }
    public selectedType(event) {
        this.item.type = event;
    }

    public setControlValid(){
        if(this.formGroup.get('type').value == 'classic'){
            this.formGroup.get('discount').setErrors(null);
        }else if(this.formGroup.get('type').value == 'percentage'){
            this.formGroup.get('initial_price').setErrors(null)
            this.formGroup.get('offer_price').setErrors(null)
        }else if(this.formGroup.get('type').value == 'free'){
            this.formGroup.get('discount').setErrors(null)
            this.formGroup.get('initial_price').setErrors(null)
            this.formGroup.get('offer_price').setErrors(null)
        }  
    }

    public validation(){
        var datepipe: DatePipe = new DatePipe('es');
        this.item.end = datepipe.transform(this.item.end, 'yyyy-MM-ddT00:00:00+00:00'); 
        this.itemCopy = {
          description: this.item.description,
          offer_price: this.item.offer_price,
          initial_price: this.item.initial_price,
          discount: this.item.discount,
          end: this.item.end,
          type: this.item.type,
          active: this.item.active,
          image: this.item.image
        }
        const initialValue = this.itemCopy;
        this.formGroup.valueChanges
          .pipe(
            debounceTime(100)
          )
          .subscribe(resp => {
            if(resp.end){
                var datepipe: DatePipe = new DatePipe('es');
                resp.end = datepipe.transform(resp.end, 'yyyy-MM-ddT00:00:00+00:00'); 
            }
            this.edited = Object.keys(initialValue).some(key => this.formGroup.value[key] != 
              initialValue[key])
            this.setControlValid();
            console.log(resp)
            console.log(this.itemCopy)
          })
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
        if(this.formGroup.invalid || !this.formGroup.dirty || !this.edited && this.isEdit){
            return;
        }
        this.item.type = this.formGroup.get('type').value;
        this.item.description = this.formGroup.get('description').value;
        this.item.active = this.formGroup.get('active').value;
        this.item.offer_price = this.formGroup.get('offer_price').value;
        this.item.discount = this.formGroup.get('discount').value;
        this.item.initial_price = this.formGroup.get('initial_price').value;
        this.item.end = this.formGroup.get('end').value;
        this.item.image = this.formGroup.get('image').value;
        this.dialogRef.close({ ...this.item });
        
    }

    public close(): void {
        this.dialogRef.close(false);
    }
}
