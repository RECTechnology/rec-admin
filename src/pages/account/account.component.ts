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
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'account',
  styleUrls: ['./account.css'],
  templateUrl: './account.html',
})
export class AccountComponent extends PageBase implements OnInit, OnDestroy {
  public pageName = 'Account';
  public currentTab = 0;
  public account_id = null;
  public sub: any = null;
  public pdfHtml = '';
  public balance = 0;
  
  public tab: string = '';
  public tabMap = {
    details: 0,
    users: 1,
    movements: 2,
    documents: 3,
    b2b: 4,
    lemonway: 5,
    tpv: 6,
    0: 'details',
    1: 'users',
    2: 'movements',
    3: 'documents',
    4: 'b2b',
    5: 'lemonway',
    6: 'tpv',
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
    public translate: TranslateService,
  ) {
    super(translate);
  }

  public ngOnInit() {
    // Register account update, fire getAccount
    this.events.registerEvent('account:update').subscribe(this.loadAccount.bind(this));

    // Gets the query parameters and gets 'tab' param
    this.sub = this.route.queryParams
      .subscribe((params) => {
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
    this.sub.unsubscribe();
    this.events.removeEvent('account:update');
  }

  public loadAccount() {
    this.loading = true;
    this.crudAccounts.find(this.account_id)
      .subscribe((resp: any) => {
        this.companyService.selectedCompany = resp.data;
        this.balance = environment.crypto_currency ? 
        this.companyService.selectedCompany.getBalance(environment.crypto_currency) : 
        this.companyService.selectedCompany.getBalance('REC');

        this.loading = false;
      }, (error) => {
        this.loading = false;
      });
  }

  /* Called when tab change, so url changes also */
  public changeUrl($event) {
    if (this.account_id) {
      this.router.navigate(['/accounts/' + this.account_id], {
        queryParams: { tab: this.tabMap[$event] },
        queryParamsHandling: 'merge',
      });
    }
  }

  public goBack() {
    this.router.navigate(['/accounts']);
  }
}
