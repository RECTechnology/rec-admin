import { AlertsService } from './../../../services/alerts/alerts.service';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TablePageBase } from 'src/bases/page-base';
import { ControlesService } from 'src/services/controles/controles.service';
import { LoginService } from 'src/services/auth/auth.service';

@Component({
  selector: 'tpv-tab',
  templateUrl: './tpv.html',
})
export class TpvTab extends TablePageBase {
  @Input() public id = '';
  @Input() public account: any = {};

  public pageName = 'TPV';
  public loading = true;
  public error = false;
  public editingUrl = false;
  public url = null;

  constructor(
    public controles: ControlesService,
    public router: Router,
    public ls: LoginService,
    public titleService: Title,
    public alerts: AlertsService,
  ) { super(); }

  public ngOnInit() {
    this.loading = true;
    super.ngOnInit();
  }

  public delete() {
    this.alerts.showConfirmation('SURE_DELETE_TPV', 'DELETE_TPV')
      .subscribe((resp) => {
        console.log('Delete: ', resp);
      });
  }

  public toggleEditUrl() {
    this.editingUrl = !this.editingUrl;
  }

  public saveEditUrl() {
    this.toggleEditUrl();

  }


  public search() {
    return;
  }
}
