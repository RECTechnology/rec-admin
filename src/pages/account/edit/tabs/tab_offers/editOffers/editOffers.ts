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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmptyValidators } from 'src/components/validators/EmptyValidators';

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
    public initialPriceNull=false;
    public offerPriceNull=false;
    public endNull = false;
    public descriptionNull=false;
    public discountNull=false;
    public fg: FormGroup;
    public types = ['percentage', 'classic', 'free'];
    public offer_image;
    constructor(
        public dialogRef: MatDialogRef<EditOfferDia>,
        public us: UserService,
        public translate: TranslateService,
        private fb: FormBuilder,
        public activitiesCrud: ActivitiesCrud,
        public productsCrud: ProductsCrud,
        public alerts: AlertsService,
    ) { this.fg = fb.group({
        description: ['', [Validators.required, ]],
        offer_price: ['', [Validators.required, ]],
        discount_percent: ['', [Validators.required, ]],
        initial_price: ['', [Validators.required, ]],
        end: ['', [Validators.required, ]],
      }) }

    public selectedType(event) {
        this.item.type = event;
    }
    get g(){
        return this.fg.controls;
      }
    public  onSubmit(){
        console.log(this.fg.value);
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
            this.alerts.showSnackbar('Need required data', 'ok');
        }
    }



    public checkData() {
        return (this.checkPercentageData() || this.checkClasicData() || this.checkFreeData()) && this.checkDescDate() && this.checkEndDate();
    }

    public checkPercentageData() {
        this.discountNull = this.item.discount == null;
        return this.item.discount != null;
    }

    public checkClasicData() {
        this.initialPriceNull = this.item.initial_price == null;
        this.offerPriceNull =  this.item.offer_price == null;
        return this.item.initial_price != null && this.item.offer_price != null;
    }

    public checkFreeData() {
        return this.item.type == 'free';
    }

    public checkEndDate() {
        this.endNull =  this.item.end == null;
        return this.item.end != null;
    }

    public checkDescDate() {
        this.descriptionNull = this.item.description == null;
        return this.item.description != null;
    }

    public ngOnInit() { }

    public close(): void {
        this.dialogRef.close(false);
    }
}
