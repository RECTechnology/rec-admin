import { Component } from '@angular/core';
import { ProductsCrud } from 'src/services/crud/products/products.crud';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material';
import { MySnackBarSevice } from 'src/bases/snackbar-base';

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
                this.products = resp;
            },
            (error) => {
                console.log('errror', error);
            },
        );
    }

    public editProducts($event) { }

    public addProduct() {
        // this.productsCrud.create({});
    }

    public deleteProduct($event) { }
}
