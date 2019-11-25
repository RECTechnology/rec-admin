import { MaterialModule } from './md-module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { SidemenuComponent } from '../components/scaffolding/sidemenu/sidemenu.component';
import { HeaderComponent } from '../components/scaffolding/header/header.component';
import { PageFooterComponent } from '../components/scaffolding/page-footer/page-footer.component';
import { CollapseCardComponent } from '../components/ui/collapse-card/collapse-card.component';
import { CompanyService } from '../services/company/company.service';
import { ButtonLoader } from '../components/ui/button-loader/button-loader';
import { CCInput } from '../components/ui/cc-input/cc-input';
import { CCInputEditable } from '../components/ui/cc-input/cc-input';
import { LangSelector } from '../components/selectors/lang-selector/lang.selector';
import { FilterComponent } from '../components/other/filter/filter-component';
import { Agregation } from '../components/ui/agregation/agregation.component';
import { DashChart } from '../components/ui/dash-chart/dash-chart.component';
import { ValidationErrorsComponent } from '../components/scaffolding/validation-errors/validation-errors.component';
import { CountrySelector } from '../components/selectors/country-selector/country-selector.component';
import { AppNotifications } from '../components/other/app-notifications/app-notifications';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from '../app/app.routing';
import { AccountSelector } from '../components/selectors/account-selector/account.selector';
import { ChangePhone } from '../pages/dashboard/dialogs/change-phone/change-phone.dia';
import { StreetTypeSelector } from '../components/selectors/street-selector/street-selector.component';
import { KeyValuePair } from '../components/ui/kvp/kvp-list/kvp-list';
import { KeyValueItem } from '../components/ui/kvp/kvp-item/kvp-item';
import { TreasureAccount } from 'src/pages/special-actions/treasure_account/treasure_account.component';
import { MapComponent } from 'src/pages/map/map.component';
import { AccountsPage } from 'src/pages/accounts/accounts.component';
import { OrganizationsComponent } from 'src/pages/organizations/organizations.component';
import { LoginComponent } from 'src/pages/login/login.component';
import { UsersPage } from 'src/pages/users/users.component';
import { TableListHeader } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { TableListSubHeader } from 'src/components/scaffolding/table-list/tl-subheader/tl-subheader.component';
import { TableListTable } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { AgmCoreModule } from '@agm/core';
import { B2BSettingsComponent } from 'src/pages/special-actions/b2b/entities/settings.component';
import { TranslatableListComponent } from 'src/pages/special-actions/b2b/components/translatable-list/translatable-list.component';
import { BaseService2 } from 'src/services/base/base.service-v2';
import { CrudBaseService } from 'src/services/base/crud.base';
import { CrudModule } from 'src/services/crud/crud.module';
import { ProductsTabComponent } from 'src/pages/special-actions/b2b/entities/components/products/products.tab';
import { ActivitiesTabComponent } from 'src/pages/special-actions/b2b/entities/components/activities/activities.tab';
import { NeighborhoodsTabComponent } from 'src/pages/special-actions/b2b/entities/components/neighborhoods/neighborhoods.tab';
import {
  NeighbourhoodSelector,
} from 'src/components/selectors/neighbourhood-selector/neighbourhood-selector.component';
import { QuillModule } from 'ngx-quill';
import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';
import { ConvertToLangPipe } from 'src/pipes/convert-to-lang/convert-to-lang.pipe';
import { EscapeHtmlPipe } from 'src/pipes/safe-html/safe-html.pipe';
import { DelegatedChangesCrud } from 'src/services/crud/delegated_changes/delegated_changes';
import { DelegatedChangesDataCrud } from 'src/services/crud/delegated_changes/delegated_changes_data';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountPickerComponent } from 'src/components/selectors/account-picker/account-picker.component';
import { Avatar } from 'src/components/ui/avatar/avatar.component';
import { BadgeComponent } from 'src/components/ui/badge/badge.component';
import { InfoFieldComponent } from 'src/components/ui/info-field/info-field.component';
import { BetaBadgeComponent } from 'src/components/ui/beta-badge/beta-badge.component';
import { IconBtnComponent } from 'src/components/ui/icon-btn/icon-btn.component';
import { ModalHeaderComponent } from 'src/components/scaffolding/modal-header/modal-header.component';
import { InputFieldComponent } from 'src/components/ui/input-field/input-field.component';
import { RaisedBtnComponent } from 'src/components/ui/raised-btn/raised-btn.component';
import { DocumentKindsTabComponent } from 'src/pages/special-actions/b2b/entities/components/document_kinds/document-kinds.tab';
import { DocumentTabComponent } from 'src/pages/special-actions/b2b/entities/components/documents/documents.tab';
import { TiersTabComponent } from 'src/pages/special-actions/b2b/entities/components/tiers/tiers.tab';
import { BussinessDetailsDia } from 'src/dialogs/management/bussiness_detailes/bussiness_details.component';
import { TwoFaDia } from 'src/components/dialogs/two_fa_prompt/two_fa_prompt.dia';
import { ExportDialog } from 'src/components/dialogs/export-dialog/export.dia';
import { VoteWithdrawal } from 'src/dialogs/vote-withdrawal/vote-withdrawal.dia';
import { AddItemDia } from 'src/pages/special-actions/b2b/entities/add-item/add-item.dia';
import { AddNeighbourhoodDia } from 'src/pages/special-actions/b2b/entities/components/neighborhoods/add/add.dia';
import { UnsavedChangesDialog } from 'src/dialogs/unsaved-changes/unsaved-changes.dia';
import { CreateLemonWithdrawalDia } from 'src/dialogs/lemonway/create-lemon-withdrawal/create-lemon-withdrawal.dia';
import { CreateLemonWallet2WalletOutDia } from 'src/dialogs/lemonway/create-lemonway-w2w-out/create-lemon-w2w-out.dia';
import { AccountPickerDia } from 'src/components/selectors/account-picker/account-picker-dialog/account-picker.dia';
import { EditAccountsDia } from 'src/pages/special-actions/change_delegate/components/edit_users/edit_accounts.dia';
import { AddUserDia } from 'src/dialogs/management/add-user/add-user.dia';
import { EditUserData } from 'src/dialogs/management/edit-user/edit-user.dia';
import { ConfirmationMessage } from 'src/components/dialogs/confirmation-message/confirmation.dia';
import { InfoMessage } from 'src/components/dialogs/info-message/info.dia';
import { FileUpload } from 'src/components/dialogs/file-upload/file-upload.dia';
import { IdleNotification } from 'src/components/dialogs/idle-notification/idle.dia';
import { ManageSms } from 'src/dialogs/management/manage-sms/manage-sms.dia';
import { AddCommentDia } from 'src/dialogs/wallet/add_comment/add_comment.dia';
import { ExportTxsDia } from 'src/dialogs/wallet/export-txs/export-txs.dia';
import { CashOutDia } from 'src/dialogs/wallet/cash-out/cash-out.dia';
import { CashOutTesoroDia } from 'src/dialogs/wallet/cash-out-tesoro/cash-out-tesoro.dia';
import { TxDetails } from 'src/dialogs/wallet/tx_details/tx_details.dia';
import { EditAccountData } from 'src/dialogs/management/edit-account/edit-account.dia';
import { AddDocumentKindDia } from 'src/dialogs/entities/add-document-kind/add-document-kind.dia';
import { AddDocumentDia } from 'src/dialogs/entities/add-document/add-document.dia';
import { AddTierDia } from 'src/dialogs/entities/add-tier/add-tier.dia';
import { FileSelector } from 'src/components/selectors/file-selector/file-selector';
import { SendMail } from 'src/pages/special-actions/mailing/send-mail/send-mail';
import { CreateDelivery } from 'src/pages/special-actions/mailing/create-delivery/create-delivery';
import { B2BSendComponent } from 'src/pages/special-actions/mailing/send.component';

const DIALOGS = [
  BussinessDetailsDia,
  TwoFaDia,
  ExportDialog,
  VoteWithdrawal,
  AddItemDia,
  AddNeighbourhoodDia,
  SendMail,
  CreateDelivery,
  UnsavedChangesDialog,
  CreateLemonWithdrawalDia,
  CreateLemonWallet2WalletOutDia,
  AccountPickerDia,
  EditAccountsDia,
  AddUserDia,
  EditUserData,
  ConfirmationMessage,
  InfoMessage,
  FileUpload,
  IdleNotification,
  ManageSms,
  AddCommentDia,
  ExportTxsDia,
  CashOutDia,
  CashOutTesoroDia,
  TxDetails,
  EditAccountData,
  AddDocumentKindDia,
  AddDocumentDia,
  AddTierDia,
];

@NgModule({
  declarations: [
    SidemenuComponent,
    HeaderComponent,
    PageFooterComponent,
    CollapseCardComponent,
    ButtonLoader,
    CCInput,
    CCInputEditable,
    LangSelector,
    FilterComponent,
    Agregation,
    DashChart,
    ValidationErrorsComponent,
    CountrySelector,
    AppNotifications,
    AccountSelector,
    ChangePhone,
    StreetTypeSelector,
    KeyValuePair,
    KeyValueItem,
    TreasureAccount,
    MapComponent,
    OrganizationsComponent,
    LoginComponent,
    AccountsPage,
    UsersPage,
    TableListHeader,
    TableListSubHeader,
    TableListTable,
    B2BSendComponent,
    B2BSettingsComponent,
    TranslatableListComponent,
    ProductsTabComponent,
    ActivitiesTabComponent,
    NeighborhoodsTabComponent,
    NeighbourhoodSelector,
    ConvertToLangPipe,
    EscapeHtmlPipe,
    AccountPickerComponent,
    Avatar,
    BadgeComponent,
    InfoFieldComponent,
    BetaBadgeComponent,
    IconBtnComponent,
    ModalHeaderComponent,
    InputFieldComponent,
    RaisedBtnComponent,
    DocumentKindsTabComponent,
    DocumentTabComponent,
    TiersTabComponent,
    FileSelector,
    ...DIALOGS,
  ],
  entryComponents: DIALOGS,
  exports: [
    TranslateModule,
    SidemenuComponent,
    HeaderComponent,
    PageFooterComponent,
    CollapseCardComponent,
    ButtonLoader,
    CCInput,
    CCInputEditable,
    LangSelector,
    FilterComponent,
    Agregation,
    DashChart,
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
    ProductsTabComponent,
    ActivitiesTabComponent,
    NeighborhoodsTabComponent,
    NeighbourhoodSelector,
    ConvertToLangPipe,
    EscapeHtmlPipe,
    Avatar,
    BadgeComponent,
    InfoFieldComponent,
    BetaBadgeComponent,
    IconBtnComponent,
    ModalHeaderComponent,
    InputFieldComponent,
    RaisedBtnComponent,
    DocumentKindsTabComponent,
    DocumentTabComponent,
    TiersTabComponent,
    FileSelector,
    ...DIALOGS,
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
    DelegatedChangesCrud,
    DelegatedChangesDataCrud,
    AlertsService,
  ],
})
export class SharedModule { }
