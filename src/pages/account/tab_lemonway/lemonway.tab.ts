import { Component, Input } from '@angular/core';
import { B2bService } from 'src/services/b2b/b2b.service';
import { TlHeader, TlItemOption, TableListOptions } from 'src/components/table-list/tl-table/tl-table.component';
import { TablePageBase } from 'src/bases/page-base';
import { ControlesService } from 'src/services/controles/controles.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { CreateLemonWithdrawalDia } from 'src/dialogs/create-lemon-withdrawal/create-lemon-withdrawal.dia';

@Component({
  selector: 'lemonway-tab',
  templateUrl: './lemonway.html',
})
export class LemonWayTab extends TablePageBase {
  @Input() public id = '';

  public withdrawals = [];
  public pageName = 'Lemonway';
  public loading = true;
  public headers: TlHeader[] = [
    {
      sort: 'id',
      title: 'ID',
      type: 'code',
    },
  ];
  public itemOptions: TlItemOption[] = [
    {
      callback: () => { },
      text: 'Edit',
      icon: 'fa-edit',
      ngIf: (item) => {
        return item.status !== 'processed';
      },
    },
    {
      callback: () => { },
      text: 'View',
      icon: 'fa-eye',
      ngIf: (item) => {
        return item.status === 'processed';
      },
    },
  ];
  public options: TableListOptions = {
    optionsType: 'buttons',
  };

  constructor(
    public controles: ControlesService,
    public b2bCrud: B2bService,
    public router: Router,
    public ls: LoginService,
    public titleService: Title,
    public alerts: AlertsService,
  ) { super(); }

  public search() {
    return;
  }

  public newWithdrawal() {
    const dialog = this.alerts.createModal(CreateLemonWithdrawalDia, {
      id: this.id,
    });
    dialog.afterClosed().subscribe((resp) => {
      this.search();
    });
  }
}
