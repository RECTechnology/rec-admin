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

@Component({
  selector: 'edit-account',
  templateUrl: './edit-account.html',
})
export class EditAccountComponent extends PageBase implements OnInit, OnDestroy {
  public pageName = 'Edit Account';
  public account_id = null;
  public queryParamsSub: any = null;
  
  public currentTab = 0;
  public tab: string = '';
  public tabMap = {
    info: 0,
    location: 1,
    marketing: 2,
    campaigns: 3,
    b2b: 4,
    schedule: 5,
    offers: 6,
    0: 'info',
    1: 'location',
    2: 'marketing',
    3: 'campaigns',
    4: 'b2b',
    5: 'schedule',
    6: 'offers',
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
      this.alerts.showSnackbar('NO_UPDATE', 'ok');
    }
  }

  private onUpdateOk(_) {
    this.alerts.showSnackbar('UPDATED_ACCOUNT', 'ok');
    this.loading = false;
    this.loadAccount();
  }

  
  private onUpdateError(error) {
    this.alerts.showSnackbar(error.errors ? error.errors[0].message : error.message, 'ok');
    this.loading = false;
  }

  /* Called when tab change, so url changes also */
  public changeUrl($event) {
    if (this.account_id) {
      this.router.navigate([], {
        queryParams: { tab: this.tabMap[$event] },
        queryParamsHandling: 'merge',
      });
    }
  }

  public goBack() {
    this.router.navigate(['/accounts/' + this.account_id]);
  }
}
