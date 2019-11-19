import { Component, AfterContentInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, Sort } from '@angular/material';
import { WalletService } from 'src/services/wallet/wallet.service';
import { UserService } from 'src/services/user.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { CompanyService } from 'src/services/company/company.service';
import { ControlesService } from 'src/services/controles/controles.service';
import { EditAccountData } from 'src/dialogs/management/edit-account/edit-account.dia';
import { TlHeader, TlItemOption, TableListOptions } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { ExportDialog } from 'src/components/dialogs/export-dialog/export.dia';
import { ListAccountsParams } from 'src/interfaces/search';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { TablePageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Account } from 'src/shared/entities/account.ent';

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
  public active = true;
  public type = '';
  public onlyExchanges = false;

  public defaultExportKvp = [
    { key: 'id', value: '$.id', active: true },
    { key: 'company_name', value: '$.name', active: true },
    { key: 'cif', value: '$.cif', active: true },
    { key: 'type', value: '$.type', active: true },
    { key: 'subtype', value: '$.subtype', active: true },
    { key: 'name', value: '$.kyc_manager.name', active: true },
    { key: 'lastname', value: '$.kyc_manager.kyc_validations.last_name', active: true },
    { key: 'street_type', value: '$.street_type', active: true },
    { key: 'street', value: '$.street', active: true },
    { key: 'address_number', value: '$.address_number', active: true },
    { key: 'dni', value: '$.kyc_manager.dni', active: true },
    { key: 'phone', value: '$.phone', active: true },
    { key: 'alias', value: '$.kyc_manager.active_card.alias', active: true },
    { key: 'amount', value: '$.wallets[0].available', active: true },
    { key: 'neighbourhood_id', value: '$.neighbourhood.id', active: true },
    { key: 'neighbourhood_name', value: '$.neighbourhood.name', active: true },
    { key: 'activities', value: '$.activities[*]', active: true },
  ];
  public headerOpts: TableListHeaderOptions = { input: true };
  public headers: TlHeader[] = [
    {
      sort: 'active',
      title: 'Active',
      type: 'checkbox',
    }, {
      sort: 'id',
      title: 'ID',
      type: 'code',
    }, {
      avatar: {
        sort: 'company_image',
        title: 'Company Image',
      },
      sort: 'name',
      title: 'Name',
      type: 'avatar',
    }, {
      sort: 'email',
      title: 'Email',
    }, {
      sort: 'type',
      statusClass: (el: any) => ({
        'col-blue': el !== 'COMPANY',
        'col-orange': el === 'COMPANY',
      }),
      title: 'Type',
      type: 'status',
    }, {
      accessor: (account: Account) => {
        return account.getBalance('REC') + ' Ɍ';
      },
      sort: 'amount',
      title: 'Amount',
      type: 'code',
    },
  ];
  public itemOptions: TlItemOption[] = [{
    callback: this.viewAccount.bind(this),
    icon: 'fa-eye',
    text: 'View',
  }, {
    callback: this.viewEditAccount.bind(this),
    icon: 'fa-edit',
    text: 'Edit Account',
  }];
  public tableOptions: TableListOptions = {
    optionsType: 'buttons',
  };
  public isComp = false;
  public isPriv = false;
  public exchangersFilters = {
    tier: 2,
    type: 'COMPANY',
  };

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
  ) {
    super();
    this.route.queryParams
      .subscribe((params) => {
        this.accountID = params.id;
        this.openDetails = params.details;
      });
  }

  public afterContentInit() {
    const roles = this.us.userData.group_data.roles;
    this.canAddUser = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_COMPANY');
  }

  public getCleanParams(query?: string) {
    let data: ListAccountsParams = {
      active: this.active ? 1 : 0,
      field_map: {},
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      search: query || this.query,
      sort: this.sortID,
      type: this.type,
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

    return data;
  }

  public search(query: string = '') {
    const data: any = this.getCleanParams(query);

    this.loading = true;
    this.crudAccounts.list(data, 'all').subscribe(
      (resp: any) => {
        this.data = resp.data.elements;
        this.total = resp.data.total;
        this.sortedData = this.data.slice();
        this.showing = this.data.length;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      });
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

  public selectType(type) {
    if (this.type === 'PRIVATE' && type === 'PRIVATE') {
      this.isPriv = false;
      this.type = '';
    } else if (type === 'PRIVATE') {
      this.isPriv = true;
      this.isComp = false;
      this.type = 'PRIVATE';
    }

    if (this.type === 'COMPANY' && type === 'COMPANY') {
      this.isComp = false;
      this.type = '';
    } else if (type === 'COMPANY') {
      this.isPriv = false;
      this.isComp = true;
      this.type = 'COMPANY';
    }

    this.search();
  }

  public changedType() {
    this.limit = 10;
    this.offset = 0;
    this.search();
  }

  public viewAccount(account, tab = 'details') {
    this.router.navigate([`/accounts/${account.id}`], { queryParams: { tab } });
  }

  public viewEditAccount(account) {
    this.alerts.openModal(EditAccountData, {
      account: { ...account },
    }).subscribe((result) => {
      this.search();
    });
  }

  public sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.sortedData = this.data.slice();
      this.sortID = 'id';
      this.sortDir = 'desc';
    } else {
      this.sortID = sort.active;
      this.sortDir = sort.direction;
    }
    this.search();
  }
}
