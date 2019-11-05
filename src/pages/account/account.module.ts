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
import { ViewDetails } from '../dialogs/view-details/view-details.dia';
import { ViewDetailsAccount } from '../dialogs/view-details-account/view-details-account.dia';
import { MovementsTab } from './tab_movements/tab_movements';
import { AccountUsersTab } from './tab_account_users/account_users.tab';
import { AccountDetailsTab } from './tab_account_details/account_details.tab';
import { EditUserData } from '../dialogs/edit-user/edit-user.dia';
import { EditAccountData } from '../dialogs/edit-account/edit-account.dia';
import { AccountDocuments } from './tab_documents/account_documents.tab';
import { CountryPickerModule } from 'ngx-country-picker';
import { B2BModuleTab } from './tab_b2b/tab_b2b.tab';

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
    EditUserData,
    Tier1Form,
    ViewDetails,
    ViewDetailsAccount,
    AccountUsersTab,
    MovementsTab,
    EditAccountData,
    AccountDetailsTab,
    AccountDocuments,
    B2BModuleTab,
  ],
  entryComponents: [
    EditUserData,
    EditAccountData,
    ViewDetails,
    ViewDetailsAccount,
    AccountUsersTab,
    AccountDocuments,
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
