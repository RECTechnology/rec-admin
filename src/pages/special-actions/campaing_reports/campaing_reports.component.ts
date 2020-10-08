import { Component, AfterContentInit } from '@angular/core';
import { WalletService } from '../../../services/wallet/wallet.service';
import { ControlesService } from '../../../services/controles/controles.service';
import { AdminService } from '../../../services/admin/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { TlHeader, TlItemOption } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TlHeaders } from 'src/data/tl-headers';
import { Sort } from '@angular/material/sort';
import { TablePageBase } from 'src/bases/page-base';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/services/auth/auth.service';
import { TlItemOptions } from 'src/data/tl-item-options';

@Component({
  selector: 'campaing_reports',
  styleUrls: ['./campaing_reports.css'],
  templateUrl: './campaing_reports.html',
})
export class CampaignReportsAccount extends TablePageBase implements AfterContentInit {
  public titleService: Title;
  public pageName: string;
  public ls: LoginService;
  public loading = false;
  public headers: TlHeader[] = [TlHeaders.Id];
  public sortedData: any[] = [];
  public data: any = [];
  public sortID: string;
  public sortDir: string;

  public headerOpts: TableListHeaderOptions = { input: true, refresh: true, deepLinkQuery: true };
  public itemOptions: TlItemOption[] = [];

  constructor(
    public controles: ControlesService,
    public ws: WalletService,
    public us: UserService,
    public as: AdminService,
    public dialog: MatDialog,
    public alerts: AlertsService,
    public crudAccounts: AccountsCrud,
  ) {
    super();
  }

  ngAfterContentInit(): void {}

  public sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.sortedData = this.data.slice();
      this.sortID = 'id';
      this.sortDir = 'desc';
    } else {
      this.sortID = sort.active;
      this.sortDir = sort.direction;
    }
    this.search(this.query);
  }

  search(query: any) {}
}
