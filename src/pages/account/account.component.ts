import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from '../../services/controles/controles.service';
import { UserService } from '../../services/user.service';
import { PageBase } from '../../bases/page-base';
import { LoginService } from '../../services/auth/auth.service';
import { MatDialog } from '../../../node_modules/@angular/material';
import { CompanyService } from '../../services/company/company.service';
import { UtilsService } from '../../services/utils/utils.service';
import { MySnackBarSevice } from '../../bases/snackbar-base';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';

@Component({
  selector: 'account',
  styleUrls: [
    './account.css',
  ],
  templateUrl: './account.html',
})
export class AccountComponent extends PageBase implements OnInit, OnDestroy {
  public pageName = 'Account';
  public currentTab = 0;
  public account_id = null;
  private sub: any = null;
  private tab: string = '';
  private tabMap = {
    details: 0,
    users: 1,
    // tslint:disable-next-line: object-literal-sort-keys
    movements: 2,
    documents: 3,
    b2b: 4,
    0: 'details',
    1: 'users',
    2: 'movements',
    3: 'documents',
    4: 'b2b',
  };

  public pdfHtml = '';

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
    public snackbar: MySnackBarSevice,
    public crudAccounts: AccountsCrud,
  ) {
    super();
  }

  public ngOnInit() {
    // Gets the query parameters and gets 'tab' param
    this.sub = this.route.queryParams
      .subscribe((params) => {
        this.tab = params.tab || 'details';
        this.currentTab = this.tabMap[this.tab] || 0;
      });

    this.route.params.subscribe((params) => {
      this.account_id = params.id;
      this.pageName = 'Account (' + this.account_id + ')';
      this.setUp();
    });
  }

  public setUp() {
    this.crudAccounts.find(this.account_id)
      .subscribe((resp) => {
        this.companyService.selectedCompany = resp;
        this.controles.showAccountDetails = true;
      }, (error) => {
        this.snackbar.open('Account not found!', 'ok');
        this.router.navigate([`/dashboard`]);
      });
  }

  /* Called when tab change, so url changes also */
  public changeUrl($event) {
    if (this.account_id) {
      this.router.navigate(['/account/' + this.account_id], {
        queryParams: { tab: this.tabMap[$event] },
        queryParamsHandling: 'merge',
      });
    }
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
