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
import { ViewDetailsAccount } from '../../dialogs/management/view-details-account/view-details-account.dia';
import { MovementsTab } from './tab_movements/tab_movements';
import { AccountUsersTab } from './tab_account_users/account_users.tab';
import { AccountDetailsTab } from './tab_account_details/account_details.tab';
import { EditUserData } from '../../dialogs/management/edit-user/edit-user.dia';
import { EditAccountData } from '../../dialogs/management/edit-account/edit-account.dia';
import { AccountDocuments } from './tab_documents/account_documents.tab';
import { CountryPickerModule } from 'ngx-country-picker';
import { B2BModuleTab } from './tab_b2b/tab_b2b.tab';
import { LemonWayTab } from './tab_lemonway/lemonway.tab';
import { CreateLemonWithdrawalDia } from 'src/dialogs/lemonway/create-lemon-withdrawal/create-lemon-withdrawal.dia';
import { CreateLemonWallet2WalletOutDia } from 'src/dialogs/lemonway/create-lemonway-w2w-out/create-lemon-w2w-out.dia';
import { CreateLemonWallet2WalletInDia } from 'src/dialogs/lemonway/create-lemonway-w2w-in/create-lemon-w2w-in.dia';

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
    LemonWayTab,
  ],
  entryComponents: [
    EditUserData,
    EditAccountData,
    ViewDetails,
    ViewDetailsAccount,
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
