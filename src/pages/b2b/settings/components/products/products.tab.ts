import { Component } from '@angular/core';

@Component({
    selector: 'tab-products',
    templateUrl: './products.html',
})
export class ProductsTabComponent {
    public products = [
        {
            // tslint:disable-next-line: object-literal-sort-keys
            id: 1, esp: 'Pan', cat: 'Pa', eng: 'Bread', pending: true,
            activities_consumed: ['Harina', 'Mantequilla'], activities_produced: ['Pan', 'ASDASd']
        },
        { id: 2, esp: 'Agua', cat: 'Aigua', eng: 'Water', pending: false },
    ];
    public productsColumns = ['id', 'cat', 'esp', 'eng', 'activities-consumed', 'activities-produced', 'actions'];

    public editProducts($event) { }

    public addProduct() { }

    public deleteProduct($event) { }
}
