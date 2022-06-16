import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from 'src/services/controles/controles.service';
import { UserService } from 'src/services/user.service';
import { PageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from 'src/services/company/company.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { EventsService } from 'src/services/events/events.service';
import { BasicInfoTab } from './tabs/tab_basic_info/basic_info.tab';
import { LocationTab } from './tabs/tab_location/location.tab';
import { CampaignsTab } from './tabs/tab_campaigns/campaigns.tab';
import { MarketingTab } from './tabs/tab_marketing/marketing.tab';
import { B2BTab } from './tabs/tab_b2b/b2b.tab';
import { ScheduleTab } from './tabs/tab_schedule/schedule.tab';
import { OffersTab } from './tabs/tab_offers/offers.tab';

@Component({
  selector: 'edit-account',
  templateUrl: './edit-account.html',
})
export class EditAccountComponent extends PageBase implements OnInit, OnDestroy {
  static readonly fieldByTab = {
    [BasicInfoTab.tabName]: BasicInfoTab.fields,
    [LocationTab.tabName]: LocationTab.fields,
    [CampaignsTab.tabName]: CampaignsTab.fields,
    [MarketingTab.tabName]: MarketingTab.fields,
  };

  public pageName = 'Edit Account';
  public account_id = null;
  public queryParamsSub: any = null;
  public edited: boolean;
  public shouldValidate = false;

  public currentTab = 0;
  public tab: string = '';
  public tabMap = {
    [BasicInfoTab.tabName]: 0,
    [LocationTab.tabName]: 1,
    [MarketingTab.tabName]: 2,
    [CampaignsTab.tabName]: 3,
    [B2BTab.tabName]: 4,
    [ScheduleTab.tabName]: 5,
    [OffersTab.tabName]: 6,
    0: BasicInfoTab.tabName,
    1: LocationTab.tabName,
    2: MarketingTab.tabName,
    3: CampaignsTab.tabName,
    4: B2BTab.tabName,
    5: ScheduleTab.tabName,
    6: OffersTab.tabName
  };

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public controles: ControlesService,
    public router: Router,
    public us: UserService,
    public companyService: CompanyService,
    public utils: UtilsService,
    public ls: LoginService,
    public dialog: MatDialog,
    public crudAccounts: AccountsCrud,
    public alerts: AlertsService,
    public events: EventsService,
  ) {
    super();
  }

  public ngOnInit() {
    this.companyService.selectedCompany = null;
    // Register account update, fire getAccount
    this.events.registerEvent('account:update').subscribe(this.loadAccount.bind(this));

    // Gets the query parameters and gets 'tab' param
    this.queryParamsSub = this.route.queryParams.subscribe((params) => {
      this.tab = params.tab || 'details';
      this.currentTab = this.tabMap[this.tab] || 0;
    });

    this.route.params.subscribe((params) => {
      this.account_id = params.id;
      this.pageName = 'Account (' + this.account_id + ')';
      this.loadAccount();
    });
  }

  public ngOnDestroy() {
    this.queryParamsSub.unsubscribe();
    this.events.removeEvent('account:update');
  }

  public loadAccount() {
    this.loading = true;
    this.crudAccounts.find(this.account_id).subscribe(
      (resp: any) => {
        this.companyService.selectedCompany = resp.data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.alerts.showSnackbar('ACCOUNT_NOT_FOUND');
        this.router.navigate(['/accounts']);
      },
    );
  }

  public update(changedProps: any) {
    if (this.loading) {
      return;
    }

    if (Object.keys(changedProps).length) {
      this.loading = true;
      this.crudAccounts.update(this.account_id, changedProps).subscribe({
        next: this.onUpdateOk.bind(this),
        error: this.onUpdateError.bind(this),
      });
    } else {
      this.edited = false;
      this.alerts.showSnackbar('NO_UPDATE', 'ok');
    }
  }

  private onUpdateOk(_) {
    this.alerts.showSnackbar('UPDATED_ACCOUNT', 'ok');
    this.edited = false;
    this.loading = false;
    this.loadAccount();
  }

  private onUpdateError(error) {
    const property = error.errors[0].property;

    for(let tabName in EditAccountComponent.fieldByTab){
      const tabField = EditAccountComponent.fieldByTab[tabName] as string[];
      const containsProperty = tabField.includes(property);

      if(containsProperty) {
        this.changeTab(tabField);
        this.shouldValidate = true;
        break;
      }
    }

    this.alerts.showSnackbar(error.errors ? error.errors[0].message : error.message, 'ok');
    this.loading = false;
    this.edited = true;
  }

  /* Called when tab change, so url changes also */
  public changeTab(tabIdOrName) {
    if (this.account_id) {
      this.router.navigate([], {
        queryParams: { tab: this.tabMap[tabIdOrName] },
        queryParamsHandling: 'merge',
      });
    }
  }

  public goBack() {
    this.router.navigate(['/accounts/' + this.account_id]);
  }
}
