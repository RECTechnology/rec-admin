import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';

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

    public actQuery = '';

    public isProduct = false;
    public isEdit = false;
    public activities = [];

    public item: any = {
        default_consuming_by: [],
        default_producing_by: [],
        cat: '',
        eng: '',
        esp: '',
    };

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
        this.activitiesCrud.list({ offset: 0, limit: 100, sort: 'name', order: 'asc' }, 'all')
            .subscribe((resp) => this.activities = resp.data.elements);
    }

    public addedSubscriber(sub, message = 'Added activity') {
        sub.subscribe(
            (resp) => {
                this.alerts.showSnackbar(message, 'ok');
                this.loading = false;
            },
            (error) => {
                this.alerts.showSnackbar(error.message, 'ok');
                this.loading = false;
            });
    }

    public deletedSubscriber(sub, message = 'Deleted activity') {
        sub.subscribe(
            (resp) => {
                this.alerts.showSnackbar(message, 'ok');
                this.loading = false;
            },
            (error) => {
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

    public ngOnInit() {
        this.check();
    }

    public add() {
        this.dialogRef.close({ ...this.item });
    }

    public close(): void {
        this.dialogRef.close(false);
    }

    public nameMatches(name: string) {
        return String(name).toLowerCase().includes(this.actQuery.toLowerCase());
    }

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
