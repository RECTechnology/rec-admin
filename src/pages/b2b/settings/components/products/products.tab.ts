import { Component } from '@angular/core';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { AddItemDia } from '../../add-item/add-item.dia';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'tab-products',
    templateUrl: './products.html',
})
export class ProductsTabComponent extends EntityTabBase {
    public products = [
        {
            // tslint:disable-next-line: object-literal-sort-keys
            id: 1, esp: 'Pan', cat: 'Pa', eng: 'Bread', pending: true,
            activities_consumed: ['Harina', 'Mantequilla'], activities_produced: ['Pan', 'ASDASd'],
        },
        { id: 2, esp: 'Agua', cat: 'Aigua', eng: 'Water', pending: false },
    ];
    public productsColumns = ['id', 'cat', 'esp', 'eng', 'activities-consumed', 'activities-produced', 'actions'];

    constructor(
        public productsCrud: ProductsCrud,
        public dialog: MatDialog,
        public snackbar: MySnackBarSevice,
    ) { super(dialog); }

    public search() {
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

                delete updated.id;
                delete updated.created;
                delete updated.updated;

                this.productsCrud.update(product.id, updated).subscribe(
                    (resp) => {
                        this.snackbar.open('Updated Product: ' + product.id, 'ok');
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
