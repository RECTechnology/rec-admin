import { MarketingTab } from './edit/tabs/tab_marketing/marketing.tab';
import { LocationTab } from './edit/tabs/tab_location/location.tab';
import { BasicInfoTab } from './edit/tabs/tab_basic_info/basic_info.tab';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AccountComponent } from './account.component';
import { IsLoggedInGuard } from '../../services/guards/login.guard';
import { TranslateModule } from '@ngx-translate/core';
import { MovementsTab } from './tab_movements/tab_movements';
import { AccountUsersTab } from './tab_account_users/account_users.tab';
import { AccountDetailsTab } from './tab_account_details/account_details.tab';
import { AccountDocuments } from './tab_documents/account_documents.tab';
import { CountryPickerModule } from 'ngx-country-picker';
import { B2BModuleTab } from './tab_b2b/tab_b2b.tab';
import { LemonWayTab } from './tab_lemonway/lemonway.tab';
import { LwTabMoneyOut } from './tab_lemonway/tabs/money-out/money-out.component';
import { LwTabWalletToWallet } from './tab_lemonway/tabs/wallet-to-wallet/wallet-to-wallet.component';
import { AddIbanDia } from 'src/dialogs/entities/add-iban/add-iban.dia';
import { TpvTab } from './tab_tpv/tpv.tab';
import { TpvOrdersComponent } from './tab_tpv/orders.component';
import { EditAccountComponent } from './edit/edit-account.component';
import { ScheduleTab } from './edit/tabs/tab_schedule/schedule.tab';
import { CampaignsTab } from './edit/tabs/tab_campaigns/campaigns.tab';
import { B2BTab } from './edit/tabs/tab_b2b/b2b.tab';
import { EditOfferDia } from './edit/tabs/tab_offers/editOffers/editOffers';
import { AddActivityDia } from './edit/tabs/tab_b2b/AddActivity/addActivity';
import { OffersTab } from './edit/tabs/tab_offers/offers.tab';
import { ScheduleDayRowComponent } from 'src/components/schedule-day-row/schedule-day-row.component';

const accountRoutes: Routes = [
  {
    canActivate: [IsLoggedInGuard],
    component: EditAccountComponent,
    path: 'accounts/edit/:id',
  },
  {
    canActivate: [IsLoggedInGuard],
    component: AccountComponent,
    path: 'accounts/:id',
  },
];

@NgModule({
  declarations: [
    AccountComponent,
    AccountUsersTab,
    MovementsTab,
    AccountDetailsTab,
    AccountDocuments,
    B2BModuleTab,
    LemonWayTab,
    LwTabMoneyOut,
    LwTabWalletToWallet,
    AddIbanDia,
    TpvTab,
    TpvOrdersComponent,
    EditAccountComponent,
    ScheduleTab,
    CampaignsTab,
    B2BTab,
    BasicInfoTab,
    LocationTab,
    MarketingTab,
    EditOfferDia,
    AddActivityDia,
    OffersTab,
    ScheduleDayRowComponent,
  ],
  entryComponents: [
    AccountUsersTab,
    AccountDocuments,
    LemonWayTab,
    B2BModuleTab,
    TpvTab,
    AddIbanDia,
    TpvOrdersComponent,
  ],
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(accountRoutes),
    SharedModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot(),
    CountryPickerModule,
  ],
})
export class AccountModule {}
