import { NgModule } from '@angular/core';
import { AccountsCrud } from './accounts/accounts.crud';
import { ProductsCrud } from './products/products.crud';
import { ActivitiesCrud } from './activities/activities.crud';
import { NeighborhoodsCrud } from './neighborhoods/neighborhoods.crud';
import { UsersCrud } from './users/users.crud';

@NgModule({
    providers: [
        AccountsCrud,
        ProductsCrud,
        ActivitiesCrud,
        NeighborhoodsCrud,
        UsersCrud,
    ],
})
export class CrudModule { }
