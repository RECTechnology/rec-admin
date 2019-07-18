
/*
  SharedModule
  Module to import in other modules with modules/components/services that will be used in
  other modules
  And also contains the routing module
*/

import { MaterialModule } from './md-module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { SidemenuComponent } from '../components/sidemenu/sidemenu.component';
import { HeaderComponent } from '../components/header/header.component';
import { PageFooterComponent } from '../components/page-footer/page-footer.component';
import { CollapseCardComponent } from '../components/collapse-card/collapse-card.component';
import { TxDetails } from '../pages/wallet/dialogs/tx_details/tx_details.dia';
import { ConfirmationMessage } from '../components/dialogs/confirmation-message/confirmation.dia';
import { InfoMessage } from '../components/dialogs/info-message/info.dia';
import { ErrorReporter } from '../components/dialogs/error-report/error-report.dia';
import { FileUpload } from '../components/dialogs/file-upload/file-upload.dia';
import { ErrorManager } from '../services/error-manager/error-manager';
import { CompanyService } from '../services/company/company.service';
import { IdleNotification } from '../components/dialogs/idle-notification/idle.dia';
import { AddUser } from '../pages/dialogs/add-user/add-user.dia';
import { ButtonLoader } from '../components/button-loader/button-loader';
import { CCInput } from '../components/cc-input/cc-input';
import { CCInputEditable } from '../components/cc-input/cc-input';
import { LangSelector } from '../components/lang-selector/lang.selector';
import { ErrorReportBtn } from '../components/error-report-btn/error-report-btn';
import { UserCurrencyPrice } from '../components/user-currency-price/user-currency.component';
import { AddCurrency, AddCurrencyDia } from '../pages/wallet/dialogs/add-currency/add-currency.dia';
import { FilterComponent } from '../components/filter/filter-component';
import { Agregation } from '../components/agregation/agregation.component';
import { DashChart } from '../components/dash-chart/dash-chart.component';
import { InDevelopment } from '../components/in-development/in-development';
import { ManageSms } from '../pages/dialogs/manage-sms/manage-sms.dia';
import { BussinessDetailsDia } from '../pages/dialogs/bussiness_detailes/bussiness_details.component';
import { ValidationErrorsComponent } from '../components/validation-errors/validation-errors.component';
import { TableListHeader } from '../components/table-list/tl-header/tl-header.component';
import { TableListSubHeader } from '../components/table-list/tl-subheader/tl-subheader.component';
import { TableListTable } from '../components/table-list/tl-table/tl-table.component';
import { CountrySelector } from '../components/country-selector/country-selector.component';
import { AppNotifications } from '../components/app-notifications/app-notifications';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [
    SidemenuComponent,
    HeaderComponent,
    PageFooterComponent,
    CollapseCardComponent,
    TxDetails,
    ConfirmationMessage,
    InfoMessage,
    FileUpload,
    ErrorReporter,
    IdleNotification,
    AddUser,
    ButtonLoader,
    CCInput,
    CCInputEditable,
    UserCurrencyPrice,
    LangSelector,
    ErrorReportBtn,
    AddCurrencyDia,
    AddCurrency,
    FilterComponent,
    Agregation,
    DashChart,
    InDevelopment,
    ManageSms,
    BussinessDetailsDia,
    ValidationErrorsComponent,
    TableListHeader,
    TableListSubHeader,
    TableListTable,
    CountrySelector,
    AppNotifications,
  ],
  entryComponents: [
    TxDetails,
    ConfirmationMessage,
    InfoMessage,
    FileUpload,
    ErrorReporter,
    IdleNotification,
    AddUser,
    AddCurrencyDia,
    ManageSms,
    BussinessDetailsDia,
  ],
  exports: [
    SidemenuComponent,
    HeaderComponent,
    PageFooterComponent,
    CollapseCardComponent,
    TxDetails,
    ConfirmationMessage,
    InfoMessage,
    FileUpload,
    ErrorReporter,
    IdleNotification,
    AddUser,
    ButtonLoader,
    CCInput,
    CCInputEditable,
    UserCurrencyPrice,
    LangSelector,
    ErrorReportBtn,
    AddCurrency,
    AddCurrencyDia,
    FilterComponent,
    Agregation,
    DashChart,
    InDevelopment,
    ValidationErrorsComponent,
    TableListHeader,
    TableListSubHeader,
    TableListTable,
    CountrySelector,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule, // Module to manage App Routing
  ],
  providers: [
    CompanyService,
    ErrorManager,
  ],
})
export class SharedModule { }
