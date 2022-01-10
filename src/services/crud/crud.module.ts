import { NgModule } from '@angular/core';
import { AccountsCrud } from './accounts/accounts.crud';
import { ProductsCrud } from './products/products.crud';
import { ActivitiesCrud } from './activities/activities.crud';
import { NeighborhoodsCrud } from './neighborhoods/neighborhoods.crud';
import { UsersCrud } from './users/users.crud';
import { DocumentKindsCrud } from './document_kinds/document_kinds';
import { DocumentCrud } from './documents/documents';
import { TiersCrud } from './tiers/tiers.crud';
import { OffersCrud } from './offers/offers.crud';

@NgModule({
    providers: [
        AccountsCrud,
        OffersCrud,
        ProductsCrud,
        ActivitiesCrud,
        NeighborhoodsCrud,
        UsersCrud,
        DocumentKindsCrud,
        DocumentCrud,
        TiersCrud,
    ],
})
export class CrudModule { }
