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
import { ActivitiesV3Crud } from './activities/activitiesv3.crud';
import { WithdrawalCrud } from './withdrawals/withdrawals.crud';

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
        ActivitiesV3Crud,
        WithdrawalCrud
    ],
})
export class CrudModule { }
