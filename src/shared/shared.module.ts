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
import { AppRoutingModule } from '../app/app.routing';
import { AccountSelector } from '../components/account-selector/account.selector';
import { ChangePhone } from '../pages/dashboard/dialogs/change-phone/change-phone.dia';
import { StreetTypeSelector } from '../components/street-selector/street-selector.component';
import { KeyValuePair } from '../components/kvp/kvp-list/kvp-list';
import { KeyValueItem } from '../components/kvp/kvp-item/kvp-item';
import { TwoFaDia } from 'src/components/dialogs/two_fa_prompt/two_fa_prompt.dia';
import { TreasureAccount } from 'src/pages/treasure_account/treasure_account.component';
import { SellersComponent } from 'src/pages/sellers/sellers.component';
import { MapComponent } from 'src/pages/map/map.component';
import { AccountsPage } from 'src/pages/accounts/accounts.component';
import { BussinessComponent } from 'src/pages/bussiness/bussiness.component';
import { LoginComponent } from 'src/components/login/login.component';
import { ExportDialog } from 'src/components/dialogs/export-dialog/export.dia';
import { UsersPage } from 'src/pages/users/users.component';
import { VoteWithdrawal } from 'src/pages/dialogs/vote-withdrawal/vote-withdrawal.dia';
import { TableListHeader } from 'src/components/table-list/tl-header/tl-header.component';
import { TableListSubHeader } from 'src/components/table-list/tl-subheader/tl-subheader.component';
import { TableListTable } from 'src/components/table-list/tl-table/tl-table.component';
import { AgmCoreModule } from '@agm/core';
import { B2BSendComponent } from 'src/pages/b2b/send/send.component';
import { B2BSettingsComponent } from 'src/pages/b2b/settings/settings.component';
import { TranslatableListComponent } from 'src/components/translatable-list/translatable-list.component';
import { EditItemDia } from 'src/pages/b2b/settings/edit-item/edit-item.dia';
import { AddItemDia } from 'src/pages/b2b/settings/add-item/add-item.dia';
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
    StreetTypeSelector,
    KeyValuePair,
    KeyValueItem,
    TwoFaDia,
    TreasureAccount,
    SellersComponent,
    MapComponent,
    BussinessComponent,
    LoginComponent,
    ExportDialog,
    BussinessComponent,
    AccountsPage,
    UsersPage,
    VoteWithdrawal,
    TableListHeader,
    TableListSubHeader,
    TableListTable,
    B2BSendComponent,
    B2BSettingsComponent,
    TranslatableListComponent,
    EditItemDia,
    AddItemDia,
  ],
  entryComponents: [
    ConfirmationMessage,
    InfoMessage,
    FileUpload,
    IdleNotification,
    AddUser,
    ManageSms,
    BussinessDetailsDia,
    TwoFaDia,
    ExportDialog,
    VoteWithdrawal,
    EditItemDia,
    AddItemDia,
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
    StreetTypeSelector,
    TableListHeader,
    TableListSubHeader,
    TableListTable,
    B2BSendComponent,
    B2BSettingsComponent,
    TranslatableListComponent,
    EditItemDia,
    AddItemDia,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule, // Module to manage App Routing
    TranslateModule.forChild(),
    AgmCoreModule,
  ],
  providers: [
    CompanyService,
    ErrorManager,
  ],
})
export class SharedModule { }
