import { NgModule } from '@angular/core';
import { AccountsCrud } from './accounts/accounts.crud';
import { ProductsCrud } from './products/products.crud';
import { ActivitiesCrud } from './activities/activities.crud';
import { NeighborhoodsCrud } from './neighborhoods/neighborhoods.crud';

@NgModule({
    providers: [
        AccountsCrud,
        ProductsCrud,
        ActivitiesCrud,
        NeighborhoodsCrud,
    ],
})
export class CrudModule { }
