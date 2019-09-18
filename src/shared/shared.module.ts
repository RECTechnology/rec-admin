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
import { CompanyService } from '../services/company/company.service';
import { IdleNotification } from '../components/dialogs/idle-notification/idle.dia';
import { AddUser } from '../pages/dialogs/add-user/add-user.dia';
import { ButtonLoader } from '../components/button-loader/button-loader';
import { CCInput } from '../components/cc-input/cc-input';
import { CCInputEditable } from '../components/cc-input/cc-input';
import { LangSelector } from '../components/lang-selector/lang.selector';
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
import { ExchangersComponent } from 'src/pages/exchangers/exchangers.component';
import { MapComponent } from 'src/pages/map/map.component';
import { AccountsPage } from 'src/pages/accounts/accounts.component';
import { OrganizationsComponent } from 'src/pages/organizations/organizations.component';
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
import { AddItemDia } from 'src/pages/b2b/settings/add-item/add-item.dia';
import { TranslatableListComponent } from 'src/pages/b2b/components/translatable-list/translatable-list.component';
import { BaseService2 } from 'src/services/base/base.service-v2';
import { CrudBaseService } from 'src/services/base/crud.base';
import { CrudModule } from 'src/services/crud/crud.module';
import { ProductsTabComponent } from 'src/pages/b2b/settings/components/products/products.tab';
import { ActivitiesTabComponent } from 'src/pages/b2b/settings/components/activities/activities.tab';
import { NeighborhoodsTabComponent } from 'src/pages/b2b/settings/components/neighborhoods/neighborhoods.tab';
import { AddNeighbourhoodDia } from 'src/pages/b2b/settings/components/neighborhoods/add/add.dia';
import { NeighbourhoodSelector } from 'src/components/neighbourhood-selector/neighbourhood-selector.component';
import { QuillModule } from 'ngx-quill';
import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';
import { SendMail } from 'src/pages/b2b/send/send-mail/send-mail';
import { CreateDelivery } from 'src/pages/b2b/send/create-delivery/create-delivery';
import { ConvertToLangPipe } from 'src/pipes/convert-to-lang/convert-to-lang.pipe';
import { EscapeHtmlPipe } from 'src/pipes/safe-html/safe-html.pipe';

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
    ExchangersComponent,
    MapComponent,
    OrganizationsComponent,
    LoginComponent,
    ExportDialog,
    AccountsPage,
    UsersPage,
    VoteWithdrawal,
    TableListHeader,
    TableListSubHeader,
    TableListTable,
    B2BSendComponent,
    B2BSettingsComponent,
    TranslatableListComponent,
    AddItemDia,
    ProductsTabComponent,
    ActivitiesTabComponent,
    NeighborhoodsTabComponent,
    AddNeighbourhoodDia,
    NeighbourhoodSelector,
    SendMail,
    CreateDelivery,
    ConvertToLangPipe,
    EscapeHtmlPipe,
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
    AddItemDia,
    AddNeighbourhoodDia,
    SendMail,
    CreateDelivery,
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
    AddItemDia,
    ProductsTabComponent,
    ActivitiesTabComponent,
    NeighborhoodsTabComponent,
    AddNeighbourhoodDia,
    NeighbourhoodSelector,
    ConvertToLangPipe,
    EscapeHtmlPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule, // Module to manage App Routing
    TranslateModule.forChild(),
    AgmCoreModule,
    CrudModule,
    QuillModule,
  ],
  providers: [
    CompanyService,
    BaseService2,
    CrudBaseService,
    MailingDeliveriesCrud,
    MailingCrud,
  ],
})
export class SharedModule { }
