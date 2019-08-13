import { Component, AfterContentInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, Sort } from '@angular/material';
import { WalletService } from '../../services/wallet/wallet.service';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils/utils.service';
import { CompanyService } from '../../services/company/company.service';
import { ControlesService } from '../../services/controles/controles.service';
import { EditAccountData } from '../dialogs/edit-account/edit-account.dia';
import { MySnackBarSevice } from '../../bases/snackbar-base';
import { environment } from '../../environments/environment';
import { TlHeader, TlItemOption, TableListOptions } from '../../components/table-list/tl-table/tl-table.component';
import { TableListHeaderOptions } from '../../components/table-list/tl-header/tl-header.component';
import { AdminService } from '../../services/admin/admin.service';
import { ExportDialog } from '../../components/dialogs/export-dialog/export.dia';
import { ListAccountsParams } from 'src/interfaces/search';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';

@Component({
  selector: 'accounts',
  styleUrls: ['./accounts.css'],
  templateUrl: './accounts.html',
})
export class AccountsPage implements AfterContentInit {
  public loading = false;
  public canAddUser = false;
  public searchQuery = '';
  public offset = 0;
  public limit = 10;
  public showingAccounts = 0;
  public totalUsers = 0;
  public sortedData: any[] = [];
  public accountID = null;
  public accounts: any[] = [];
  public openDetails = false;

  public Brand: any = environment.Brand;
  public sortID: string = 'id';
  public sortDir: string = 'desc';
  public active = true;
  public type = '';

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
  ];

  public headerOpts: TableListHeaderOptions = { input: true };
  public headers: TlHeader[] = [{
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
    accessor: 'available',
    sort: 'amount',
    title: 'Amount',
  }];

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
    public snackbar: MySnackBarSevice,
    // public as: AdminService,
    public crudAccounts: AccountsCrud,
  ) {
    this.route.queryParams
      .subscribe((params) => {
        this.accountID = params.id;
        this.openDetails = params.details;
      });
  }

  public ngAfterContentInit() {
    const roles = this.us.userData.group_data.roles;
    this.canAddUser = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_COMPANY'); // <<< TODO: Improve
    this.route.queryParams.subscribe((params) => {
      if (!params.sort) {
        this.getAccounts();
      }
    });
  }

  public getCleanParams(query?: string) {
    const data: ListAccountsParams = {
      active: this.active ? 1 : 0,
      field_map: {},
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      search: query || this.searchQuery,
      sort: this.sortID,
      type: this.type,
    };

    if (!data.type) {
      delete data.type;
    }

    return data;
  }

  public getAccounts(query: string = '') {
    const data: ListAccountsParams = this.getCleanParams(query);

    this.loading = true;
    this.crudAccounts.search(data).subscribe(
      (resp) => {
        this.companyService.companies = resp.data.elements;
        this.companyService.totalAccounts = resp.data.total;

        this.sortedData = this.companyService.companies.slice();
        this.showingAccounts = this.companyService.companies.length;
        this.loading = false;

        this.accounts = this.companyService.companies;

        // TODO: Improve this, should search for account in API instead of listed accounts
        if (this.openDetails) {
          const acc = this.accounts.filter((el) => el.id === this.accountID);
          if (acc.length) {
            this.viewAccount(acc[0]);
          }
        }
      },
      (error) => {
        this.loading = false;
        // tslint:disable-next-line
        console.log(error);
      });
  }

  public exportCall(opts) {
    return this.crudAccounts.export(opts);
  }

  public export() {
    const data: ListAccountsParams = this.getCleanParams();

    delete data.offset;
    delete data.limit;

    const dialogRef = this.dialog.open(ExportDialog);
    dialogRef.componentInstance.filters = data;
    dialogRef.componentInstance.fn = this.crudAccounts.export.bind(this.crudAccounts);
    dialogRef.componentInstance.entityName = 'Accounts';
    dialogRef.componentInstance.defaultExports = [...this.defaultExportKvp];
    dialogRef.componentInstance.list = [...this.defaultExportKvp];

    return dialogRef.afterClosed();
  }

  public selectType(type) {
    // console.log(type, this.type);
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
    this.router.navigate([`/account/${account.id}`], { queryParams: { tab } });
  }

  public viewEditAccount(account) {
    const dialogRef = this.dialog.open(EditAccountData);
    dialogRef.componentInstance.account = account;

    dialogRef.afterClosed()
      .subscribe((result) => {
        this.search();
      });
  }

  public sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.sortedData = this.companyService.companies.slice();
      this.sortID = 'id';
      this.sortDir = 'desc';
    } else {
      this.sortID = sort.active;
      this.sortDir = sort.direction;
    }
    this.search();
  }

  public search(query: string = '') {
    this.getAccounts(query);
  }

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = this.limit * ($event.pageIndex);
    this.getAccounts();
  }
}
