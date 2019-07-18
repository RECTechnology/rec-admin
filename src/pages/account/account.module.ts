import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AccountComponent } from './account.component';
import { KycTab } from './tab_kyc/kyc.tab';
import { IsLoggedInGuard } from '../../services/guards/login.guard';
import { Tier1Form } from './tab_kyc/tier_validation/tier_validation.component';
import { TranslateModule } from 'ng2-translate';
import { ViewDetails } from '../dialogs/view-details/view-details.dia';
import { ViewDetailsAccount } from '../dialogs/view-details-account/view-details-account.dia';
import { ShowMovements } from '../dialogs/show-movements/show-movements.dia';
import { MovementsTab } from './tab_movements/tab_movements';
import { AccountUsersTab } from './tab_account_users/account_users.tab';
import { AccountDetailsTab } from './tab_account_details/account_details.tab';
import { EditUserData } from '../dialogs/edit-user/edit-user.dia';
import { EditAccountData } from '../dialogs/edit-account/edit-account.dia';
import { AccountDocuments } from './tab_documents/account_documents.tab';

const accountRoutes: Routes = [
  {
    canActivate: [IsLoggedInGuard],
    component: AccountComponent,
    path: 'account/:id',
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
    ShowMovements,
    AccountUsersTab,
    MovementsTab,
    EditAccountData,
    AccountDetailsTab,
    AccountDocuments,
  ],
  entryComponents: [
    EditUserData,
    EditAccountData,
    ViewDetails,
    ViewDetailsAccount,
    ShowMovements,
    AccountUsersTab,
    AccountDocuments,
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
  ],
})
export class AccountModule { }
