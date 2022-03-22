import { Component } from '@angular/core';
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
export class EditOfferDia {
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
    public description = new FormControl('', [Validators.required]);
    public offer_price = new FormControl('', [Validators.required]);
    public discount_percent = new FormControl('', [Validators.required]);
    public initial_price = new FormControl('', [Validators.required]);
    public end = new FormControl('', [Validators.required]);
    public type = new FormControl('', [Validators.required]);
    constructor(
        public dialogRef: MatDialogRef<EditOfferDia>,
        public us: UserService,
        public translate: TranslateService,
        public activitiesCrud: ActivitiesCrud,
        public productsCrud: ProductsCrud,
        public alerts: AlertsService,
    ) {

    }

    public selectedType(event) {
        this.item.type = event;
    }
    public ngOnChanges() {
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
        if (this.checkData()) {
            this.dialogRef.close({ ...this.item });
        } else {
            this.alerts.showSnackbar('NEED_DATA', 'ok');
        }
    }


    public checkData() {
        return this.checkTypes() && this.checkDescDate() && this.checkEndDate();
    }

    public checkTypes() {
        this.type.markAsTouched();
        return this.checkPercentageData() || this.checkClasicData() || this.checkFreeData()
    }

    public checkPercentageData() {
        this.discount_percent.markAsTouched();
        return this.item.discount != null;
    }

    public checkClasicData() {
        this.offer_price.markAsTouched();
        this.initial_price.markAsTouched();
        return this.item.initial_price != null && this.item.offer_price != null;
    }

    public checkFreeData() {
        return this.item.type == 'free';
    }

    public checkEndDate() {
        this.end.markAsTouched();
        return this.item.end != null;
    }

    public checkDescDate() {
        this.description.markAsTouched();
        return this.item.description != null;
    }


    public close(): void {
        this.dialogRef.close(false);
    }
}
