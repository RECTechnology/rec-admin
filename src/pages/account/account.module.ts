import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AccountComponent } from './account.component';
import { KycTab } from './tab_kyc/kyc.tab';
import { IsLoggedInGuard } from '../../services/guards/login.guard';
import { Tier1Form } from './tab_kyc/tier_validation/tier_validation.component';
import { TranslateModule } from '@ngx-translate/core';
import { ViewDetails } from '../../dialogs/management/view-details/view-details.dia';
import { MovementsTab } from './tab_movements/tab_movements';
import { AccountUsersTab } from './tab_account_users/account_users.tab';
import { AccountDetailsTab } from './tab_account_details/account_details.tab';
import { AccountDocuments } from './tab_documents/account_documents.tab';
import { CountryPickerModule } from 'ngx-country-picker';
import { B2BModuleTab } from './tab_b2b/tab_b2b.tab';
import { LemonWayTab } from './tab_lemonway/lemonway.tab';

const accountRoutes: Routes = [
  {
    canActivate: [IsLoggedInGuard],
    component: AccountComponent,
    path: 'accounts/:id',
  },
];

@NgModule({
  declarations: [
    AccountComponent,
    KycTab,
    Tier1Form,
    ViewDetails,
    AccountUsersTab,
    MovementsTab,
    AccountDetailsTab,
    AccountDocuments,
    B2BModuleTab,
    LemonWayTab,
  ],
  entryComponents: [
    ViewDetails,
    AccountUsersTab,
    AccountDocuments,
    LemonWayTab,
    B2BModuleTab,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot(accountRoutes),
    SharedModule,
    BrowserModule,
    FormsModule,
    TranslateModule.forRoot(),
    CountryPickerModule,
  ],
})
export class AccountModule { }
