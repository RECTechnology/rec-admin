import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import {MatStepperModule} from '@angular/material/stepper';
import { ModalHeaderComponent } from 'src/components/scaffolding/modal-header/modal-header.component';
import { AppPage } from 'src/components/scaffolding/page/page-component';
import { TableListHeader } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { TableListSubHeader } from 'src/components/scaffolding/table-list/tl-subheader/tl-subheader.component';
import { TableListTable } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { AccountPickerComponent } from 'src/components/selectors/account-picker/account-picker.component';
import { EmptyValidators } from 'src/components/validators/EmptyValidators';
import { CampaignSelector } from 'src/components/selectors/campaign-selector/campaign-selector.component';
import { FileSelector } from 'src/components/selectors/file-selector/file-selector';
import { NeighbourhoodSelector } from 'src/components/selectors/neighbourhood-selector/neighbourhood-selector.component';
import { UserPickerComponent } from 'src/components/selectors/user-picker/user-picker/user-picker.component';
import { Avatar } from 'src/components/ui/avatar/avatar.component';
import { BadgeComponent } from 'src/components/ui/badge/badge.component';
import { BetaBadgeComponent } from 'src/components/ui/beta-badge/beta-badge.component';
import { CopiableComponent } from 'src/components/ui/copiable/copiable.component';
import { IconBtnComponent } from 'src/components/ui/icon-btn/icon-btn.component';
import { InfoFieldComponent } from 'src/components/ui/info-field/info-field.component';
import { InputFieldComponent } from 'src/components/ui/input-field/input-field.component';
import { StatusInputFieldComponent } from 'src/components/ui/status-input-field/status-input-field.component';
import { RaisedBtnComponent } from 'src/components/ui/raised-btn/raised-btn.component';
import { ValidateWithdrawalComponent } from 'src/components/validate-withdrawal/validate-withdrawal.component';
import { AddDocumentKindDia } from 'src/dialogs/entities/add-document-kind/add-document-kind.dia';
import { AddDocumentDia } from 'src/dialogs/entities/add-document/add-document.dia';
import { AddTierDia } from 'src/dialogs/entities/add-tier/add-tier.dia';
import { CreateLemonWithdrawalDia } from 'src/dialogs/lemonway/create-lemon-withdrawal/create-lemon-withdrawal.dia';
import { CreateLemonWallet2WalletOutDia } from 'src/dialogs/lemonway/create-lemonway-w2w-out/create-lemon-w2w-out.dia';
import { AddUserDia } from 'src/dialogs/management/add-user/add-user.dia';
import { BussinessDetailsDia } from 'src/dialogs/management/bussiness_detailes/bussiness_details.component';
import { EditUserData } from 'src/dialogs/management/edit-user/edit-user.dia';
import { ManageSms } from 'src/dialogs/management/manage-sms/manage-sms.dia';
import { RefundOrderDia } from 'src/dialogs/management/refund-order/refund-order';
import { ConfirmationMessage } from 'src/dialogs/other/confirmation-message/confirmation.dia';
import { ExportDialog } from 'src/dialogs/other/export-dialog/export.dia';
import { FileUpload } from 'src/dialogs/other/file-upload/file-upload.dia';
import { IdleNotification } from 'src/dialogs/other/idle-notification/idle.dia';
import { InfoMessage } from 'src/dialogs/other/info-message/info.dia';
import { UnsavedChangesDialog } from 'src/dialogs/unsaved-changes/unsaved-changes.dia';
import { VoteWithdrawal } from 'src/dialogs/vote-withdrawal/vote-withdrawal.dia';
import { AddCommentDia } from 'src/dialogs/wallet/add_comment/add_comment.dia';
import { CashOutTesoroDia } from 'src/dialogs/wallet/cash-out-tesoro/cash-out-tesoro.dia';
import { CashOutDia } from 'src/dialogs/wallet/cash-out/cash-out.dia';
import { ExportTxsDia } from 'src/dialogs/wallet/export-txs/export-txs.dia';
import { TxDetails } from 'src/dialogs/wallet/tx_details/tx_details.dia';
import { CopyClipboardDirective } from 'src/directives/clipboard.directive';
import { CollapsableWhen } from 'src/directives/collapsable.directive';
import { AccountsPage } from 'src/pages/accounts/accounts.component';
import { RatingsPage } from 'src/pages/ratings/ratings.component';
import { LoginComponent } from 'src/pages/login/login.component';
import { MapComponent } from 'src/pages/map/map.component';
import { OrganizationsComponent } from 'src/pages/organizations/organizations.component';
import { TranslatableListComponent } from 'src/pages/special-actions/b2b/components/translatable-list/translatable-list.component';
import { AddItemDia } from 'src/pages/special-actions/b2b/entities/add-item/add-item.dia';
import { ActivitiesTabComponent } from 'src/pages/special-actions/b2b/entities/components/activities/activities.tab';
import { DocumentTabComponent } from 'src/pages/special-actions/b2b/entities/components/documents/documents.tab';
import { DocumentKindsTabComponent } from 'src/pages/special-actions/b2b/entities/components/document_kinds/document-kinds.tab';
import { ActivityPicker } from 'src/components/selectors/activity-picker/activity-picker';
import { DocumentKindPicker } from 'src/components/selectors/document-kind-picker/document-kind-picker';
import { DocumentStatusSelector } from 'src/components/selectors/document-status-selector/document-status-selector';
import { BasePicker } from 'src/components/selectors/base-picker/base-picker';
import { DatePicker } from 'src/components/selectors/date-picker/date-picker';
import { AddNeighbourhoodDia } from 'src/pages/special-actions/b2b/entities/components/neighborhoods/add/add.dia';
import { NeighborhoodsTabComponent } from 'src/pages/special-actions/b2b/entities/components/neighborhoods/neighborhoods.tab';
import { ProductsTabComponent } from 'src/pages/special-actions/b2b/entities/components/products/products.tab';
import { TiersTabComponent } from 'src/pages/special-actions/b2b/entities/components/tiers/tiers.tab';
import { B2BSettingsComponent } from 'src/pages/special-actions/b2b/entities/settings.component';
import { B2BComponent } from 'src/pages/special-actions/b2b_page/b2b.component';
import { CampaignReportsAccount } from 'src/pages/special-actions/campaing_reports/campaing_reports.component';
import { EditAccountsDia } from 'src/pages/special-actions/change_delegate/components/edit_users/edit_accounts.dia';
import { CreateDelivery } from 'src/pages/special-actions/mailing/create-delivery/create-delivery';
import { DeliveryEntry } from 'src/pages/special-actions/mailing/delivery-entry/delivery-entry.component';
import { SendMail } from 'src/pages/special-actions/mailing/send-mail/send-mail';
import { B2BSendComponent } from 'src/pages/special-actions/mailing/send.component';
import { TreasureAccount } from 'src/pages/special-actions/treasure_account/treasure_account.component';
import { UsersPage } from 'src/pages/users/users.component';
import { ConvertToLangPipe } from 'src/pipes/convert-to-lang/convert-to-lang.pipe';
import { MaskPipe } from 'src/pipes/mask/mask.pipe';
import { EscapeHtmlPipe } from 'src/pipes/safe-html/safe-html.pipe';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { BaseService2 } from 'src/services/base/base.service-v2';
import { CrudBaseService } from 'src/services/base/crud.base';
import { CampaignsCrud } from 'src/services/crud/campaigns/campaigns.service';
import { CrudModule } from 'src/services/crud/crud.module';
import { DelegatedChangesCrud } from 'src/services/crud/delegated_changes/delegated_changes';
import { DelegatedChangesDataCrud } from 'src/services/crud/delegated_changes/delegated_changes_data';
import { IbansCrud } from 'src/services/crud/ibans/ibans.crud';
import { LemonwayDocumentCrud } from 'src/services/crud/lemonway_documents/lemonway_documents';
import { LemonDocumentKindsCrud } from 'src/services/crud/lemon_document_kinds/lemon_document_kinds';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';
import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { EventsService } from 'src/services/events/events.service';
import { AppRoutingModule } from '../app/app.routing';
import { AppNotifications } from '../components/other/app-notifications/app-notifications';
import { FilterComponent } from '../components/other/filter/filter-component';
import { HeaderComponent } from '../components/scaffolding/header/header.component';
import { PageFooterComponent } from '../components/scaffolding/page-footer/page-footer.component';
import { SidemenuComponent } from '../components/scaffolding/sidemenu/sidemenu.component';
import { ValidationErrorsComponent } from '../components/scaffolding/validation-errors/validation-errors.component';
import { CountrySelector } from '../components/selectors/country-selector/country-selector.component';
import { LangSelector } from '../components/selectors/lang-selector/lang.selector';
import { StreetTypeSelector } from '../components/selectors/street-selector/street-selector.component';
import { Agregation } from '../components/ui/agregation/agregation.component';
import { ButtonLoader } from '../components/ui/button-loader/button-loader';
import { CCInput, CCInputEditable } from '../components/ui/cc-input/cc-input';
import { CollapseCardComponent } from '../components/ui/collapse-card/collapse-card.component';
import { DashChart } from '../components/ui/dash-chart/dash-chart.component';
import { KeyValueItem } from '../components/ui/kvp/kvp-item/kvp-item';
import { KeyValuePair } from '../components/ui/kvp/kvp-list/kvp-list';
import { ChangePhone } from '../pages/dashboard/dialogs/change-phone/change-phone.dia';
import { CompanyService } from '../services/company/company.service';
import { MaterialModule } from './md-module';
import { LogViewComponent } from 'src/components/log-view/log-view.component';
import { LogPage } from 'src/pages/special-actions/change_delegate/components/log_page/log_page';
import { LogStatusSelector } from 'src/components/selectors/log-status-selector/log-status-selector.component';
import { SendTransactionsDia } from 'src/pages/special-actions/change_delegate/components/new_massive_transactions/send_transaction_modal/send_transactions_modal';
import { AddB2BModal } from 'src/pages/special-actions/b2b_page/b2b-modal/b2b-modal';
import { ActiveGroupSelector } from '../components/selectors/active-group-selector/active-group-selector';
import { RecStatusSelector } from '../components/selectors/rec-status-selector/rec-status-selector';
import { AvatarBadges } from '../components/ui/avatar-badges/avatar-badges.component';
import { BadgesSelector } from '../components/selectors/badges-selector/badges-selector';
import { AvatarUser } from '../components/ui/avatar-user/avatar-user.component';
import { UserCode } from 'src/components/ui/user-code/user-code';
import { ExportSentDialog } from 'src/dialogs/other/export-sent-dialog/export-sent.dia';
import { ChallengesPage } from '../pages/challenges/challenges.component';
import { RewardsTab } from '../pages/challenges/tab_rewards/tab_rewards';
import { ChallengesTab } from 'src/pages/challenges/tab_challenges/tab_challenges';
import { AddChallengeDia } from 'src/dialogs/challenges/add-challenge/add-challenge.dia';
import { AddRewardsDia } from 'src/dialogs/challenges/add-reward/add-reward.dia';
import { RewardSelector } from '../components/selectors/reward-selector/reward-selector';
import { ParametrizationComponent } from '../pages/parametrization/parametrization.component';
import { ConfigurationSettingsCrud } from '../services/crud/config_settings/configuration_settings';
import { CampaignsPage } from '../pages/campaigns/campaigns.component';
import { AddCampaignDia } from 'src/dialogs/campaigns/add-campaign.dia';
import { SaveChangesMessage } from 'src/dialogs/other/save-changes/save-changes.dia';
import { AccountIdTableColumn } from 'src/components/ui/account_id/account_id.component';
import { StatusWithTimeComponent } from '../components/ui/status_with_time/status_with_time.component';
import { StatusCampaignsDetailsComponent } from '../components/ui/status_campaign_details/status-campaigns-details.component';
import { ExportCampaignsUsers } from 'src/dialogs/campaigns/export-campaigns/export-campaigns.dia';
import { GenericDialog } from 'src/dialogs/other/generic-dialog/generic-dialog';
import { AddProductDia } from 'src/pages/special-actions/b2b/entities/add-product/add-product.dia';
import { DuplicatedProduct } from 'src/pages/special-actions/b2b/entities/duplicated-product/duplicated-product.dia';

const DIALOGS = [
  BussinessDetailsDia,
  ExportDialog,
  ExportCampaignsUsers,
  VoteWithdrawal,
  AddItemDia,
  AddProductDia,
  DuplicatedProduct,
  AddNeighbourhoodDia,
  SendMail,
  CreateDelivery,
  UnsavedChangesDialog,
  CreateLemonWithdrawalDia,
  CreateLemonWallet2WalletOutDia,
  EditAccountsDia,
  AddUserDia,
  AddChallengeDia,
  AddCampaignDia,
  AddRewardsDia,
  EditUserData,
  ConfirmationMessage,
  InfoMessage,
  GenericDialog,
  FileUpload,
  IdleNotification,
  ManageSms,
  AddCommentDia,
  ExportTxsDia,
  CashOutDia,
  CashOutTesoroDia,
  TxDetails,
  AddDocumentKindDia,
  AddChallengeDia,
  AddDocumentDia,
  AddTierDia,
  RefundOrderDia,
  CopiableComponent,
  ExportSentDialog,
];

const DIRECTIVES = [CollapsableWhen, CopyClipboardDirective];

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
    RewardSelector,
    FilterComponent,
    Agregation,
    DashChart,
    ValidationErrorsComponent,
    CountrySelector,
    AppNotifications,
    ChangePhone,
    StreetTypeSelector,
    KeyValuePair,
    KeyValueItem,
    TreasureAccount,
    MapComponent,
    OrganizationsComponent,
    LoginComponent,
    AccountsPage,
    ParametrizationComponent,
    ChallengesPage,
    RewardsTab,
    ChallengesTab,
    RatingsPage,
    UsersPage,
    CampaignsPage,
    CampaignReportsAccount,
    TableListHeader,
    TableListSubHeader,
    TableListTable,
    B2BSendComponent,
    B2BSettingsComponent,
    B2BComponent,
    LogStatusSelector,
    LogViewComponent,
    LogPage,
    SendTransactionsDia,
    SaveChangesMessage,
    AddB2BModal,
    TranslatableListComponent,
    ProductsTabComponent,
    ActivitiesTabComponent,
    NeighborhoodsTabComponent,
    NeighbourhoodSelector,
    DocumentStatusSelector,
    RecStatusSelector,
    ConvertToLangPipe,
    EscapeHtmlPipe,
    AccountPickerComponent,
    Avatar,
    AvatarBadges,
    AvatarUser,
    AccountIdTableColumn,
    StatusWithTimeComponent,
    StatusCampaignsDetailsComponent,
    UserCode,
    BadgeComponent,
    InfoFieldComponent,
    BetaBadgeComponent,
    IconBtnComponent,
    ModalHeaderComponent,
    InputFieldComponent,
    StatusInputFieldComponent,
    RaisedBtnComponent,
    DocumentKindsTabComponent,
    ActivityPicker,
    DocumentKindPicker,
    BasePicker,
    DatePicker,
    DocumentTabComponent,
    TiersTabComponent,
    FileSelector,
    MaskPipe,
    AppPage,
    DeliveryEntry,
    CopiableComponent,
    ValidateWithdrawalComponent,
    CampaignSelector,
    BadgesSelector,
    UserPickerComponent,
    ActiveGroupSelector,
    ...DIALOGS,
    ...DIRECTIVES,
  ],
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
    ChangePhone,
    StreetTypeSelector,
    TableListHeader,
    TableListSubHeader,
    TableListTable,
    B2BSendComponent,
    B2BSettingsComponent,
    B2BComponent,
    LogStatusSelector,
    RewardSelector,
    LogViewComponent,
    LogPage,
    SendTransactionsDia,
    SaveChangesMessage,
    AddB2BModal,
    TranslatableListComponent,
    ProductsTabComponent,
    ActivitiesTabComponent,
    NeighborhoodsTabComponent,
    NeighbourhoodSelector,
    CampaignSelector,
    BadgesSelector,
    ConvertToLangPipe,
    EscapeHtmlPipe,
    CampaignReportsAccount,
    Avatar,
    UserCode,
    AvatarBadges,
    AccountIdTableColumn,
    StatusWithTimeComponent,
    StatusCampaignsDetailsComponent,
    BadgeComponent,
    InfoFieldComponent,
    BetaBadgeComponent,
    IconBtnComponent,
    ModalHeaderComponent,
    InputFieldComponent,
    StatusInputFieldComponent,
    RaisedBtnComponent,
    DocumentKindsTabComponent,
    ActivityPicker,
    DocumentKindPicker,
    DocumentStatusSelector,
    RecStatusSelector,
    BasePicker,
    DatePicker,
    DocumentTabComponent,
    TiersTabComponent,
    FileSelector,
    MaskPipe,
    AppPage,
    CampaignSelector,
    BadgesSelector,
    UserPickerComponent,
    ActiveGroupSelector,
    ...DIALOGS,
    ...DIRECTIVES,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,
    TranslateModule.forChild(),
    AgmCoreModule,
    CrudModule,
    QuillModule,
    MatStepperModule
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
    LemonDocumentKindsCrud,
    LemonwayDocumentCrud,
    ConfigurationSettingsCrud,
    EventsService,
    IbansCrud,
    CampaignsCrud,
  ],
})
export class SharedModule {}
