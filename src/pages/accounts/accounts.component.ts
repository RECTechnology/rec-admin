import { Component, AfterContentInit, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WalletService } from 'src/services/wallet/wallet.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { CompanyService } from 'src/services/company/company.service';
import { ControlesService } from 'src/services/controles/controles.service';
import {
  TlHeader,
  TlItemOption,
  TableListOptions,
} from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { ExportDialog } from 'src/dialogs/other/export-dialog/export.dia';
import { ListAccountsParams } from 'src/interfaces/search';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { TablePageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Account } from 'src/shared/entities/account.ent';
import { TlHeaders } from 'src/data/tl-headers';
import { TlItemOptions } from 'src/data/tl-item-options';
import { AccountsExportDefaults } from 'src/data/export-defaults';
import { CampaignsCrud } from 'src/services/crud/campaigns/campaigns.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'accounts',
  styleUrls: ['./accounts.css'],
  templateUrl: './accounts.html',
})
export class AccountsPage extends TablePageBase implements AfterContentInit {
  public pageName = 'Accounts';
  public canAddUser = false;
  public sortedData: Account[] = [];
  public accountID = null;
  public openDetails = false;
  public active = false;
  public type = '';
  public onlyExchanges:boolean;

  public tableOptions: TableListOptions = {
    optionsType: 'buttons',
    onClick: (entry) => this.viewAccount(entry),
  };

  public defaultExportKvp = AccountsExportDefaults;
  public headerOpts: TableListHeaderOptions = { input: true, refresh: true, deepLinkQuery: true };
  public headers: TlHeader[] = [
    TlHeaders.Id,
    TlHeaders.AvatarCompany,
    TlHeaders.Email,
    TlHeaders.LwBalance,
    TlHeaders.AccountType,
    TlHeaders.AccountAmountREC,
  ];
  public itemOptions: TlItemOption[] = [TlItemOptions.Edit(this.viewEditAccount.bind(this))];
  public isComp = false;
  public isPriv = false;
  public exchangersFilters = {
    tier: 2,
    type: 'COMPANY',
  };
  public campaignFilter: any = '';

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public us: UserService,
    public companyService: CompanyService,
    public utils: UtilsService,
    public router: Router,
    public controles: ControlesService,
    public ws: WalletService,
    public ls: LoginService,
    public crudAccounts: AccountsCrud,
    public alerts: AlertsService,
    protected campaignsService: CampaignsCrud,
  ) {
    super(router);
  }

  ngOnInit(){
    super.ngOnInit();

    this.route.queryParams.subscribe((params) => {

      this.accountID = params.id;
      this.openDetails = params.details;
      this.limit = params.limit ?? 10;
      this.offset = params.offset;
      if(params.type != null){
        this.type = params.type;
      }

      this.active = params.active =='true';
      this.onlyExchanges = params.onlyExchanges =='true';
      this.campaignsService.list({ limit: 100 }).subscribe((resp) => {
        for (let element of resp.data.elements) {
          if (element.id == params.campaignFilter) {
            this.campaignFilter = element;
          }
        }
      });
    });
  }
  public onlyExchangesChange() {
    super.addToQueryParams({
      onlyExchanges: this.onlyExchanges,
    });
    this.search();
  }

  public addActive(event:MatCheckboxChange){
    this.active = event.checked;
    super.addToQueryParams({
      active: this.active,
    });
    this.search();
  }

 ngOnChange(){
  }

  public afterContentInit() {
    const roles = this.us.userData.group_data.roles;
    this.canAddUser = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_COMPANY');
  }

  public campaignFilterChanged(campaignFilter) {
    this.campaignFilter = campaignFilter;
    super.addToQueryParams({
      campaignFilter: this.campaignFilter.id,
    });
    this.search();
  }

  public getCleanParams(query?: string) {
    let data: ListAccountsParams = {
      
      active: this.active? 1:0,
      field_map: {},
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      search: query || this.query,
      sort: this.sortID,
      type: this.type,
      campaigns: this.campaignFilter ? this.campaignFilter.id : null,
    };

    if (this.onlyExchanges) {
      data = {
        ...data,
        ...this.exchangersFilters,
      };
    }

    if (!data.type) {
      delete data.type;
    }

    if (!data.campaigns) {
      delete data.campaigns;
    }

    return data;
  }

  public search(query: string = this.query) {

    const data: any = this.getCleanParams(query);
    this.loading = true;
    this.query = query;

    this.searchObs = this.crudAccounts.list(data, 'all').subscribe(
      (resp: any) => {
        this.data = resp.data.elements;
        this.total = resp.data.total;
        this.sortedData = this.data.slice();
        this.showing = this.data.length;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      },
    );
    return this.searchObs;
  }

  public exportCall(opts) {
    return this.crudAccounts.export(opts);
  }

  public export() {
    const data: ListAccountsParams = this.getCleanParams();

    delete data.offset;
    delete data.limit;

    return this.alerts.openModal(ExportDialog, {
      defaultExports: [...this.defaultExportKvp],
      entityName: 'Accounts',
      filters: data,
      fn: this.crudAccounts.export.bind(this.crudAccounts),
      list: [...this.defaultExportKvp],
    });
  }

  public changedType() {
    this.limit = 10;
    this.offset = 0;
    super.addToQueryParams({
      type: this.type,
    });

  }

  public viewAccount(account, tab = 'details') {
    this.router.navigate([`/accounts/${account.id}`], { queryParams: { tab } });
  }

  public viewEditAccount(account, tab = 'info') {
    this.router.navigate([`/accounts/edit/${account.id}`], { queryParams: { tab } });
  }
}
