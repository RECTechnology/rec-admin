import { Component, ViewChild } from '@angular/core';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { AddItemDia } from '../../add-item/add-item.dia';
import { forkJoin } from 'rxjs';
import { TranslatableListComponent } from 'src/pages/b2b/components/translatable-list/translatable-list.component';

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
        public snackbar: MySnackBarSevice,
    ) { super(dialog); }

    public search() {
        console.log('this.list', this.list);
        this.productsCrud.search({
            limit: this.limit,
            offset: this.offset,
            query: {
                search: this.query,
            },
        }).subscribe(
            (resp) => {
                console.log('products', resp);
                this.data = resp.data.elements.map((elem) => {
                    elem.eng = elem.name;
                    return elem;
                });
                this.sortedData = this.data.slice();
                this.total = resp.data.total;
                this.list.updateData(this.data);
            },
            (error) => {
                console.log('errror', error);
            },
        );
    }

    public editProducts(product) {
        const ref = this.dialog.open(AddItemDia);
        ref.componentInstance.isEdit = true;
        ref.componentInstance.isProduct = true;
        ref.componentInstance.item = Object.assign({}, product);

        ref.afterClosed().subscribe((updated) => {
            if (updated) {
                const proms = [
                    this.productsCrud.update(product.id, { name: updated.cat }, 'ca'),
                    this.productsCrud.update(product.id, { name: updated.esp }, 'es'),
                    this.productsCrud.update(product.id, { name: updated.eng }, 'en'),
                ];

                forkJoin(proms).subscribe(
                    (resp) => {
                        this.snackbar.open('Updated product: ' + product.id, 'ok');
                        this.search();
                    },
                    (error) => this.snackbar.open(error.message),
                );
            }
        });
    }

    public addProduct() {
        const ref = this.dialog.open(AddItemDia);
        ref.componentInstance.isEdit = false;
        ref.componentInstance.isProduct = true;

        ref.afterClosed().subscribe((created) => {
            if (created) {
                delete created.activities_consumed;
                delete created.activities_produced;

                this.productsCrud.create({ name: created.eng, description: '' }, 'en')
                    .subscribe(
                        (prod) => {
                            const proms = [
                                this.productsCrud.update(prod.data.id, { name: created.cat }, 'ca'),
                                this.productsCrud.update(prod.data.id, { name: created.esp }, 'es'),
                            ];

                            return forkJoin(proms).subscribe((resp) => {
                                this.snackbar.open('Created Product: ' + prod.id, 'ok');
                                this.search();
                            });
                        },
                        (error) => {
                            console.log(error);
                            this.snackbar.open(error.message);
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
                                this.snackbar.open('Deleted Product', 'ok');
                                this.search();
                            },
                            (error) => this.snackbar.open(error.message),
                        );
                    }
                },
            );
    }
}
