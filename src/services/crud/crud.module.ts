import { NgModule } from '@angular/core';
import { AccountsCrud } from './accounts/accounts.crud';
import { ProductsCrud } from './products/products.crud';

@NgModule({
    exports: [
        // AccountsCrud,
        // ProductsCrud,
    ],
    providers: [
        AccountsCrud,
        ProductsCrud,
    ],
})
export class CrudModule { }
