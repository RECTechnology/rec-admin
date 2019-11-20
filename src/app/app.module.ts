
import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components & dialogs
import { AppComponent } from './app.component';
import { WalletModule } from 'src/pages/wallet/wallet.module';
import { ChangeDelegateModule } from 'src/pages/change_delegate/change_delegate.module';
import { LoginService, AppAuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user.service';
import { IsLoggedInGuard, IsNotLoggedInGuard, IsResellerGuard } from 'src/services/guards/login.guard';
import { ControlesService } from 'src/services/controles/controles.service';
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
import { MatPaginatorIntl, RippleGlobalOptions, MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material';
import { CountryPickerModule } from 'ngx-country-picker';
import { QuillModule } from 'ngx-quill';

import { DashboardModule } from 'src/pages/dashboard/dashboard.module';
import { HttpErrorInterceptor } from 'src/services/interceptor';
import { AccountModule } from 'src/pages/account/account.module';
import { B2bService } from 'src/services/b2b/b2b.service';
import { PendingChangesGuard } from 'src/services/guards/can-go-back.guard';
import { MySentry } from 'src/shared/sentry';
import { environment } from 'src/environments/environment';
import { SentryErrorHandler } from 'src/shared/sentry-error-handler';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import localeCat from '@angular/common/locales/ca-ES-VALENCIA';

registerLocaleData(localeCat);
registerLocaleData(localeEn);
registerLocaleData(localeEs);

MySentry.setup(environment);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

const globalRippleConfig: RippleGlobalOptions = {
  animation: {
    enterDuration: 300,
    exitDuration: 0,
  },
  disabled: true,
};

const LOCALE = navigator.languages[1];
const imports = [
  BrowserModule,
  FormsModule,
  HttpClientModule,
  BrowserAnimationsModule,
  SharedModule,
  DashboardModule,
  WalletModule,
  ChangeDelegateModule,
  AccountModule,
  TranslateModule.forRoot({
    loader: {
      deps: [HttpClient],
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
    },
  }),
  BrowserAnimationsModule,
  MaterialModule,
  CountryPickerModule.forRoot({
    baseUrl: '/assets/countries/',
    filename: 'countries.json',
  }),
  QuillModule.forRoot(),
];

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports,
  providers: [
    LoginService,
    UserService,
    AppAuthService,
    IsLoggedInGuard,
    ControlesService,
    TransactionService,
    IsLoggedInGuard,
    IsNotLoggedInGuard,
    IsResellerGuard,
    PendingChangesGuard,
    WalletService,
    UtilsService,
    TranslateService,
    AdminService,
    XHR,
    MySnackBarSevice,
    NotificationService,
    B2bService,
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
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
    },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
  ],
})
export class AppModule { }
