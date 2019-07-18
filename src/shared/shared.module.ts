import { MaterialModule } from './md-module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { SidemenuComponent } from '../components/sidemenu/sidemenu.component';
import { HeaderComponent } from '../components/header/header.component';
import { PageFooterComponent } from '../components/page-footer/page-footer.component';
import { CollapseCardComponent } from '../components/collapse-card/collapse-card.component';
import { ConfirmationMessage } from '../components/dialogs/confirmation-message/confirmation.dia';
import { InfoMessage } from '../components/dialogs/info-message/info.dia';
import { FileUpload } from '../components/dialogs/file-upload/file-upload.dia';
import { ErrorManager } from '../services/error-manager/error-manager';
import { CompanyService } from '../services/company/company.service';
import { IdleNotification } from '../components/dialogs/idle-notification/idle.dia';
import { AddUser } from '../pages/dialogs/add-user/add-user.dia';
import { ButtonLoader } from '../components/button-loader/button-loader';
import { CCInput } from '../components/cc-input/cc-input';
import { CCInputEditable } from '../components/cc-input/cc-input';
import { LangSelector } from '../components/lang-selector/lang.selector';
import { UserCurrencyPrice } from '../components/user-currency-price/user-currency.component';
import { FilterComponent } from '../components/filter/filter-component';
import { Agregation } from '../components/agregation/agregation.component';
import { DashChart } from '../components/dash-chart/dash-chart.component';
import { InDevelopment } from '../components/in-development/in-development';
import { ManageSms } from '../pages/dialogs/manage-sms/manage-sms.dia';
import { BussinessDetailsDia } from '../pages/dialogs/bussiness_detailes/bussiness_details.component';
import { ValidationErrorsComponent } from '../components/validation-errors/validation-errors.component';
import { CountrySelector } from '../components/country-selector/country-selector.component';
import { AppNotifications } from '../components/app-notifications/app-notifications';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from 'src/app/app.routing';
import { TableListModule } from 'src/components/table-list/table-list-module';
import { AccountSelector } from 'src/components/account-selector/account.selector';
import { ChangePhone } from 'src/pages/dashboard/dialogs/change-phone/change-phone.dia';
import { DashboardModule } from 'src/pages/dashboard/dashboard.module';

@NgModule({
  declarations: [
    SidemenuComponent,
    HeaderComponent,
    PageFooterComponent,
    CollapseCardComponent,
    ConfirmationMessage,
    InfoMessage,
    FileUpload,
    IdleNotification,
    AddUser,
    ButtonLoader,
    CCInput,
    CCInputEditable,
    UserCurrencyPrice,
    LangSelector,
    FilterComponent,
    Agregation,
    DashChart,
    InDevelopment,
    ManageSms,
    BussinessDetailsDia,
    ValidationErrorsComponent,
    CountrySelector,
    AppNotifications,
    AccountSelector,
    ChangePhone,
  ],
  entryComponents: [
    ConfirmationMessage,
    InfoMessage,
    FileUpload,
    IdleNotification,
    AddUser,
    ManageSms,
    BussinessDetailsDia,
  ],
  exports: [
    SidemenuComponent,
    HeaderComponent,
    PageFooterComponent,
    CollapseCardComponent,
    ConfirmationMessage,
    InfoMessage,
    FileUpload,
    IdleNotification,
    AddUser,
    ButtonLoader,
    CCInput,
    CCInputEditable,
    UserCurrencyPrice,
    LangSelector,
    FilterComponent,
    Agregation,
    DashChart,
    InDevelopment,
    ValidationErrorsComponent,
    CountrySelector,
    MaterialModule,
    AccountSelector,
    ChangePhone,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule, // Module to manage App Routing
    TranslateModule.forChild(),
  ],
  providers: [
    CompanyService,
    ErrorManager,
  ],
})
export class SharedModule { }
