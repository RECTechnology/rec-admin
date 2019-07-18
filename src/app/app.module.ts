
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';

// Custom I18 provider for translating AngularMaterial

// Components & dialogs
import { AppComponent } from './app.component';
import { AccountModule } from 'src/pages/account/account.module';
import { WalletModule } from 'src/pages/wallet/wallet.module';
import { ChangeDelegateModule } from 'src/pages/change_delegate/change_delegate.module';
import { CompaniesModule } from 'src/pages/companies/companies.module';
// import { CountryPickerModule } from 'angular2-countrypicker';
import { LoginComponent } from 'src/components/login/login.component';
import { DashboardComponent } from 'src/pages/dashboard/dashboard.component';
import { DevOptions } from 'src/components/login/dev-options/dev-options.dia';
import { BetaTerms } from 'src/components/login/beta-terms/beta-terms.dia';
import { DataProtection } from 'src/components/login/data-protection/data-protection.dia';
import { TwoFaDia } from 'src/components/dialogs/two_fa_prompt/two_fa_prompt.dia';
import { BussinessComponent } from 'src/pages/bussiness/bussiness.component';
import { SellersComponent } from 'src/pages/sellers/sellers.component';
import { UsersPage } from 'src/pages/users/users.component';
import { AccountsPage } from 'src/pages/accounts/accounts.component';
import { TreasureAccount } from 'src/pages/treasure_account/treasure_account.component';
import { ExportExchangersDia } from 'src/pages/sellers/dialogs/export-sellers/export-sellers.dia';
import { VoteWithdrawal } from 'src/pages/dialogs/vote-withdrawal/vote-withdrawal.dia';
import { KeyValuePair } from 'src/components/kvp/kvp-list/kvp-list';
import { KeyValueItem } from 'src/components/kvp/kvp-item/kvp-item';
import { ExportDialog } from 'src/components/dialogs/export-dialog/export.dia';
import { MapComponent } from 'src/pages/map/map.component';
import { LoginService, AppAuthService, RegisterService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { IsLoggedInGuard, IsNotLoggedInGuard, IsResellerGuard } from 'src/services/guards/login.guard';
import { ControlesService } from 'src/services/controles/controles.service';
import { CurrenciesService } from 'src/services/currencies/currencies.service';
import { TransactionService } from 'src/services/transactions/transactions.service';
import { WalletService } from 'src/services/wallet/wallet.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { AdminService } from 'src/services/admin/admin.service';
import { XHR } from 'src/services/xhr/xhr';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { NotificationService } from 'src/services/notifications/notifications.service';
import { SharedModule } from 'src/shared/shared.module';
import { MdI18n } from 'src/shared/md-i18n';
import { MaterialModule } from 'src/shared/md-module';
import { MatPaginatorIntl } from '@angular/material';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import localeCat from '@angular/common/locales/ca-ES-VALENCIA';
import { DashboardModule } from 'src/pages/dashboard/dashboard.module';
import { TableListModule } from 'src/components/table-list/table-list-module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

registerLocaleData(localeCat);
registerLocaleData(localeEn);
registerLocaleData(localeEs);

const LOCALE = navigator.languages[1];

const imports = [
  BrowserModule,
  FormsModule,
  HttpClientModule,
  BrowserAnimationsModule,
  SharedModule, // Contains shared imports and Routes
  AccountModule,
  DashboardModule,
  WalletModule,
  TableListModule,
  ChangeDelegateModule,
  CompaniesModule,
  TranslateModule.forRoot({
    loader: {
      deps: [HttpClient],
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
    },
  }),
  BrowserAnimationsModule,
  MaterialModule,
  AgmCoreModule.forRoot({
    apiKey: 'YOUR_KEY',
  }),
  // CountryPickerModule.forRoot({
  //   baseUrl: '/assets/countries/',
  // }),
];

const declarations = [
  AppComponent,
  LoginComponent,
  DevOptions,
  BetaTerms,
  DataProtection,
  TwoFaDia,
  BussinessComponent,
  SellersComponent,
  UsersPage,
  AccountsPage,
  TreasureAccount,
  ExportExchangersDia,
  VoteWithdrawal,
  KeyValuePair,
  KeyValueItem,
  ExportDialog,
  MapComponent,
];

const providers = [
  LoginService,
  UserService,
  AppAuthService,
  RegisterService,
  IsLoggedInGuard,
  ControlesService,
  CurrenciesService,
  TransactionService,
  IsLoggedInGuard,
  IsNotLoggedInGuard,
  IsResellerGuard,
  WalletService,
  UtilsService,
  TranslateService,
  AdminService,
  XHR,
  MySnackBarSevice,
  NotificationService,
  {
    // Provide locale so angular can show localized dates
    provide: LOCALE_ID,
    useValue: LOCALE,
  },
  {
    // Provide custom MdI18 provider
    provide: MatPaginatorIntl,
    useClass: MdI18n,
    useValue: LOCALE,
  },
];
const entryComponents = [
  DevOptions,
  BetaTerms,
  DataProtection,
  TwoFaDia,
  ExportExchangersDia,
  VoteWithdrawal,
  ExportDialog,
];

@NgModule({
  /**
   * Root Component is 'AppComponent'
   * AppComponent is the first component to be rendered,
   * and all the other components are rendered inside <router-outlet> based on the route
   */
  bootstrap: [AppComponent],
  declarations,
  entryComponents,
  imports,
  providers,
  // imports: [BrowserAnimationsModule],
})
export class AppModule { }
