import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from '../../services/controles/controles.service';
import { UserService } from '../../services/user.service';
import { PageBase } from '../../bases/page-base';
import { LoginService } from '../../services/auth.service';
import { MatDialog, Sort } from '@angular/material';
import { TlHeader } from '../../components/table-list/tl-table/tl-table.component';
import { AdminService } from '../../services/admin/admin.service';
import { ListAccountsParams } from '../../interfaces/search';
import { ExportDialog } from '../../components/dialogs/export-dialog/export.dia';

@Component({
  selector: 'sellers',
  styleUrls: [
    './sellers.css',
  ],
  templateUrl: './sellers.html',
})
export class SellersComponent extends PageBase {
  public pageName = 'Exchangers';
  public totalBussiness = 0;
  public limit = 10;
  public showing = 0;
  public sortedData = [];
  public sellerList = [];
  public wholesale = 1;
  public retailer = 1;
  public only_offers = false;

  public filterChanged = false;
  public filterActive = 3; // 3 is an invalid filter so it will be unselected

  public sortID: string = 'id';
  public sortDir: string = 'desc';
  public query: string = '';

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
    },
  ];

  public defaultExportKvp = [
    { key: 'id', value: '$.id', active: true },
    { key: 'name', value: '$.name', active: true },
  ];

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public controles: ControlesService,
    public router: Router,
    public us: UserService,
    public ls: LoginService,
    public dialog: MatDialog,
    public as: AdminService,
  ) {
    super();
    this.getSellers();
  }

  public getSellers(query: string = '') {
    const data: ListAccountsParams = this.getCleanParams();

    this.loading = true;
    this.as.listAccountsV3(data).subscribe(
      (resp) => {
        this.sellerList = resp.data.elements;
        this.totalBussiness = resp.data.total;
        this.sortedData = this.sellerList.slice();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      },
    );
  }

  public search(query: string = '') {
    this.filterChanged = true;
    this.getSellers(query);
  }

  public sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.sortedData = this.sellerList.slice();
      this.sortID = 'id';
      this.sortDir = 'DESC';
    } else {
      this.sortID = sort.active;
      this.sortDir = sort.direction.toUpperCase();
    }
    this.search();
  }

  public getCleanParams(query?: string) {
    const data: ListAccountsParams = {
      active: 1,
      field_map: {},
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      search: query,
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

    const dialogRef = this.dialog.open(ExportDialog);
    dialogRef.componentInstance.filters = data;
    dialogRef.componentInstance.fn = this.as.exportAccountsV3.bind(this.as);
    dialogRef.componentInstance.entityName = 'Exchangers';
    dialogRef.componentInstance.defaultExports = [...this.defaultExportKvp];
    dialogRef.componentInstance.list = [...this.defaultExportKvp];

    return dialogRef.afterClosed();
  }

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = this.limit * ($event.pageIndex);
    this.search();
  }
}
