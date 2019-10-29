import { Component } from '@angular/core';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material';
import { AddItemDia } from '../../add-item/add-item.dia';
import { forkJoin } from 'rxjs';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { Product } from 'src/shared/entities/translatable/product.ent';
import { Activity } from 'src/shared/entities/translatable/activity.ent';
import { UserService } from 'src/services/user.service';

@Component({
    selector: 'tab-products',
    templateUrl: './products.html',
})
export class ProductsTabComponent extends EntityTabBase {
    public products: Product[] = [];
    public productsColumns = ['id', 'cat', 'esp', 'eng', 'activities-consumed', 'activities-produced', 'actions'];
    public sortElementsToRevise = true;
    public activityConsumedFilter = null;
    public activityProducedFilter = null;
    public activities: Activity[] = [];
    public langMap = {
        cat: 'ca',
        en: 'en',
        es: 'es',
    };

    constructor(
        public productsCrud: ProductsCrud,
        public dialog: MatDialog,
        public alerts: AlertsService,
        public translate: TranslateService,
        public actCrud: ActivitiesCrud,
        public us: UserService,
    ) {
        super(dialog, alerts);
        this.translate.onLangChange.subscribe(() => {
            this.search();
            this.getActivities();
        });

        this.getActivities();
    }

    public getActivities() {
        this.actCrud.list({
            offset: 0,
            limit: 300,
            sort: 'name',
            order: 'asc',
        }, this.langMap[this.us.lang]).subscribe((resp) => {
            this.activities = resp.data.elements;
            console.log('this.activities', this.activities);
        });
    }

    public search() {
        this.loading = true;

        if (this.sortElementsToRevise) {
            this.sortID = 'status';
        }

        const default_consuming_by = [this.activityConsumedFilter ? this.activityConsumedFilter.id : null];
        const default_producing_by = [this.activityProducedFilter ? this.activityProducedFilter.id : null];

        this.productsCrud.search({
            order: this.sortDir,
            limit: this.limit,
            offset: this.offset,
            search: this.query || '',
            sort: this.sortID,
            default_consuming_by,
            default_producing_by,
        }, 'all').subscribe(
            (resp) => {
                this.data = resp.data.elements.map(this.mapTranslatedElement);
                this.sortedData = this.data.slice();
                this.total = resp.data.total;
                this.list.updateData(this.data);
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            },
        );
    }

    public editProducts(product, skip = false) {
        this.confirm('WARNING', 'ACTIVITY_DESC', 'Edit', 'warning', skip)
            .subscribe((proceed) => {
                if (proceed) {
                    this.alerts.openModal(AddItemDia, {
                        isEdit: true,
                        isProduct: true,
                        item: Object.assign({}, product),
                        itemType: 'PRODUCT',
                    }).subscribe((updated) => {
                        if (updated) {
                            this.loading = true;
                            this.productsCrud.update(product.id, {
                                name_ca: updated.name_ca,
                                name_es: updated.name_es,
                                name: updated.name,
                            }, 'en').subscribe(
                                (resp) => {
                                    this.alerts.showSnackbar('Updated product: ' + product.id, 'ok');
                                    this.loading = false;
                                    this.search();
                                },
                                (error) => {
                                    this.alerts.showSnackbar(error.message);
                                    this.loading = false;
                                },
                            );
                        }
                    });
                }
            });
    }

    public addProduct() {
        this.alerts.openModal(AddItemDia, {
            isEdit: false,
            isProduct: true,
            itemType: 'PRODUCT',
        }).subscribe((created) => {
            if (created) {
                this.loading = true;
                this.productsCrud.create({
                    name: created.name,
                    name_ca: created.name_ca,
                    name_es: created.name_es,
                    description: '',
                    status: 'reviewed',
                }, 'en').subscribe(
                    (prod) => {
                        this.alerts.showSnackbar('Created Product', 'ok');
                        this.loading = false;
                        this.search();
                    },
                    (error) => {
                        this.loading = false;
                        this.alerts.showSnackbar(error.message);
                    },
                );
            }
        });
    }

    public deleteProduct(product) {
        this.confirm('Delete Product ' + product.id, 'Are you sure you want to delete that? No going back.')
            .subscribe(
                (del) => {
                    if (del) {
                        this.productsCrud.remove(product.id).subscribe(
                            (resp) => {
                                this.alerts.showSnackbar('Deleted Product', 'ok');
                                this.search();
                            },
                            (error) => this.alerts.showSnackbar(error.message),
                        );
                    }
                },
            );
    }

    public aproveProduct(product) {
        this.confirm('Confirm product', 'APROVE_DESC', 'APROVE', 'warning')
            .subscribe(
                (aprove) => {
                    if (aprove) {
                        this.productsCrud.update(product.id, { status: 'reviewed' }).subscribe(
                            (resp) => {
                                this.alerts.showSnackbar('Product approved', 'ok');
                                this.search();
                            },
                            (error) => this.alerts.showSnackbar(error.message),
                        );
                    }
                },
            );
    }

    public selectActivityConsumedToFilter(activity) {
        this.activityConsumedFilter = activity;
        this.search();
    }
}
