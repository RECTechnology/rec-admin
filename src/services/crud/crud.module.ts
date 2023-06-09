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
import { BadgesCrud } from './badges/badges.crud';
import { QualificationsCrud } from './qualifications/qualifications.crud';
import { WithdrawalCrud } from './withdrawals/withdrawals.crud';
import { ConfigurationSettingsCrud } from './config_settings/configuration_settings';
import { ChallengeCrud } from './challenges/challenges.crud';
import { RewardsCrud } from './reward/reward.crud';
import { AccountCampaignsCrud } from './account_campaigns/account-campaigns.crud';
import { CampaignUsersCrud } from './user_campaigns/user-campaigns.crud';

@NgModule({
    providers: [
        AccountsCrud,
        AccountCampaignsCrud,
        OffersCrud,
        ChallengeCrud,
        ProductsCrud,
        RewardsCrud,
        ActivitiesCrud,
        NeighborhoodsCrud,
        UsersCrud,
        DocumentKindsCrud,
        DocumentCrud,
        TiersCrud,
        ActivitiesV3Crud,
        BadgesCrud,
        QualificationsCrud,
        WithdrawalCrud,
        ConfigurationSettingsCrud,
        CampaignUsersCrud
    ],
})
export class CrudModule { }
