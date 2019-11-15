import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from '../../services/controles/controles.service';
import { TablePageBase } from '../../bases/page-base';
import { LoginService } from '../../services/auth/auth.service';
import { TlHeader, TlItemOption } from '../../components/scaffolding/table-list/tl-table/tl-table.component';
import { ListAccountsParams } from '../../interfaces/search';
import { ExportDialog } from '../../components/dialogs/export-dialog/export.dia';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Account } from 'src/shared/entities/account.ent';

@Component({
  selector: 'exchangers',
  styleUrls: [
    './exchangers.css',
  ],
  templateUrl: './exchangers.html',
})
export class ExchangersComponent extends TablePageBase {
  public pageName = 'Exchangers';
  public wholesale = 1;
  public retailer = 1;
  public only_offers = false;
  public loading = true;

  public filterChanged = false;
  public filterActive = 3; // 3 is an invalid filter so it will be unselected

  public headers: TlHeader[] = [
    {
      sort: 'id',
      title: 'ID',
    },
    {
      avatar: {
        sort: 'company_image',
        title: 'Company Image',
      },
      sort: 'name',
      title: 'Name',
      type: 'avatar',
    },
    {
      sort: 'amount',
      title: 'Amount',
      type: 'code',
      accessor: (account: Account) => {
        return account.getBalance('REC') + ' Ɍ';
      },
    },
  ];

  public defaultExportKvp = [
    { key: 'id', value: '$.id', active: true },
    { key: 'name', value: '$.name', active: true },
  ];

  public itemOptions: TlItemOption[] = [
    {
      callback: this.viewAccount.bind(this),
      icon: 'eye',
      text: 'View Account',
    }];

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public controles: ControlesService,
    public router: Router,
    public ls: LoginService,
    public accountsCrud: AccountsCrud,
    public alerts: AlertsService,
  ) {
    super();
  }

  public ngOnInit() {
    // this.search();
  }

  public search(query: string = '') {
    const data: ListAccountsParams = this.getCleanParams(query);

    this.loading = true;
    this.accountsCrud.list(data).subscribe(
      (resp) => {
        this.data = resp.data.elements;
        this.total = resp.data.total;
        this.sortedData = this.data.slice();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      },
    );
  }

  public getCleanParams(query?: string) {
    const data: ListAccountsParams = {
      active: 1,
      field_map: {},
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      search: query || this.query,
      sort: this.sortID,
      tier: 2,
      type: 'COMPANY',
    };

    return data;
  }

  public export() {
    const data: ListAccountsParams = this.getCleanParams();

    delete data.offset;
    delete data.limit;

    return this.alerts.openModal(ExportDialog, {
      defaultExports: [...this.defaultExportKvp],
      entityName: 'Exchangers',
      filters: data,
      fn: this.accountsCrud.export.bind(this.accountsCrud),
      list: [...this.defaultExportKvp],
    });
  }

  public viewAccount(data) {
    this.router.navigate(['/accounts/' + data.id]);
  }
}
