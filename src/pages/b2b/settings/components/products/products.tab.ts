import { Component } from '@angular/core';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material';
import { AddItemDia } from '../../add-item/add-item.dia';
import { forkJoin } from 'rxjs';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'tab-products',
    templateUrl: './products.html',
})
export class ProductsTabComponent extends EntityTabBase {
    public products = [];
    public productsColumns = ['id', 'cat', 'esp', 'eng', 'activities-consumed', 'activities-produced', 'actions'];

    constructor(
        public productsCrud: ProductsCrud,
        public dialog: MatDialog,
        public alerts: AlertsService,
        public translate: TranslateService,
    ) { super(dialog, alerts);
        this.translate.onLangChange.subscribe(() => {
            this.search();
        });
    }

    public search() {
        this.loading = true;
        this.productsCrud.search({
            dir: this.sortDir,
            limit: this.limit,
            offset: this.offset,
            search: this.query || '',
            sort: this.sortID,
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
                            const proms = [
                                this.productsCrud.update(product.id, { name: updated.cat }, 'ca'),
                                this.productsCrud.update(product.id, { name: updated.esp }, 'es'),
                                this.productsCrud.update(product.id, { name: updated.eng }, 'en'),
                            ];

                            forkJoin(proms).subscribe(
                                (resp) => {
                                    this.alerts.showSnackbar('Updated product: ' + product.id, 'ok');
                                    this.loading = false;
                                    this.search();
                                },
                                (error) => this.alerts.showSnackbar(error.message),
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
                this.productsCrud.create({ name: created.eng, description: '' }, 'en')
                    .subscribe(
                        (prod) => {
                            const productID = prod.data.id;

                            const proms = [
                                this.productsCrud.update(productID, { name: created.cat }, 'ca'),
                                this.productsCrud.update(productID, { name: created.esp }, 'es'),
                            ];

                            return forkJoin(proms).subscribe((resp) => {
                                this.alerts.showSnackbar('Created Product', 'ok');
                                this.loading = false;
                                this.search();
                            });
                        },
                        (error) => {
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
}
