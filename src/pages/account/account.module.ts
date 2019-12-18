import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AccountComponent } from './account.component';
import { IsLoggedInGuard } from '../../services/guards/login.guard';
import { TranslateModule } from '@ngx-translate/core';
import { ViewDetails } from '../../dialogs/management/view-details/view-details.dia';
import { MovementsTab } from './tab_movements/tab_movements';
import { AccountUsersTab } from './tab_account_users/account_users.tab';
import { AccountDetailsTab } from './tab_account_details/account_details.tab';
import { AccountDocuments } from './tab_documents/account_documents.tab';
import { CountryPickerModule } from 'ngx-country-picker';
import { B2BModuleTab } from './tab_b2b/tab_b2b.tab';
import { LemonWayTab } from './tab_lemonway/lemonway.tab';
import { LwTabMoneyOut } from './tab_lemonway/tabs/money-out/money-out.component';
import { LwTabWalletToWallet } from './tab_lemonway/tabs/wallet-to-wallet/wallet-to-wallet.component';
import { LwTabIbans } from './tab_lemonway/tabs/ibans/ibans.component';
import { AddIbanDia } from 'src/dialogs/entities/add-iban/add-iban.dia';

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
    ViewDetails,
    AccountUsersTab,
    MovementsTab,
    AccountDetailsTab,
    AccountDocuments,
    B2BModuleTab,
    LemonWayTab,
    LwTabMoneyOut,
    LwTabWalletToWallet,
    LwTabIbans,
    AddIbanDia,
  ],
  entryComponents: [
    ViewDetails,
    AccountUsersTab,
    AccountDocuments,
    LemonWayTab,
    B2BModuleTab,
    AddIbanDia,
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
