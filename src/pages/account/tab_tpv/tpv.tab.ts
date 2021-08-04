import { EventsService } from 'src/services/events/events.service';
import { AdminService } from 'src/services/admin/admin.service';
import { AlertsService } from './../../../services/alerts/alerts.service';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TablePageBase } from 'src/bases/page-base';
import { ControlesService } from 'src/services/controles/controles.service';
import { LoginService } from 'src/services/auth/auth.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { Pos } from 'src/shared/entities/pos.ent';
import { CompanyService } from 'src/services/company/company.service';

@Component({
  selector: 'tpv-tab',
  templateUrl: './tpv.html',
})
export class TpvTab extends TablePageBase {
  @Input() public id = '';
  @Input() public account: any = {};

  public pos: Pos;

  public pageName = 'TPV';
  public loading = true;
  public editingUrl = false;
  public url = null;
  public validationErrors: any = [];
  public validationErrorName = '';

  public notification_url = '';
  public isActive = false;

  constructor(
    public controles: ControlesService,
    public router: Router,
    public ls: LoginService,
    public titleService: Title,
    public alerts: AlertsService,
    public admin: AdminService,
    public events: EventsService,
    public companyService: CompanyService,
  ) { super(); }

  public ngOnInit() {
    const pos = this.companyService.selectedCompany.pos;
    if (pos) {
      this.notification_url = pos.notification_url;
      this.isActive = pos.active;
    }

    super.ngOnInit();
  }

  public delete() {
    this.alerts.showConfirmation('SURE_DELETE_TPV', 'DELETE_TPV')
      .subscribe((resp) => {
        if (resp) {
          console.log('Delete: ', resp);
          this.deleteTpv();
        }
      });
  }

  public toggleEditUrl() {
    this.editingUrl = !this.editingUrl;
  }

  public saveEditUrl() {
    this.updateTpv();
  }

  public toggleActive(evt) {
    this.isActive = evt.checked;

    if (evt.checked === false) {
      this.alerts.showConfirmation('SURE_DEACTIVATE_TPV', 'DEACTIVATE_TPV')
        .subscribe((resp) => {
          if (resp) {
            this.updateTpv({ active: false });
          } else {
            this.isActive = true;
          }
        });
    } else {
      this.isActive = true;
      this.updateTpv({ active: true });
    }
  }

  public deleteTpv() {
    this.loading = true;
    this.admin.deletePos(this.account.pos?.id)
      .subscribe((resp) => {
        this.loading = false;
        this.alerts.showSnackbar('DELETED_POS');
        this.events.fireEvent('account:update');
        this.ngOnInit();
      }, UtilsService.handleValidationError.bind(this, this));
  }

  public createTpv() {
    this.loading = true;
    this.admin.createPos(this.account.id)
      .subscribe((resp) => {
        this.loading = false;
        this.alerts.showSnackbar('CREATED_POS');
        this.account.pos = resp.data;
        this.validationErrors = [];
        this.ngOnInit();
      }, UtilsService.handleValidationError.bind(this, this));
  }

  public updateTpv(additionalData: any = {}) {
    this.loading = true;
    this.admin.editPos(this.account.pos?.id, { notification_url: this.notification_url, ...additionalData })
      .subscribe((resp) => {
        this.alerts.showSnackbar('UPDATED_POS');
        this.loading = false;
        this.editingUrl = false;
        this.validationErrors = [];
        this.events.fireEvent('account:update');
        this.isActive = 'active' in additionalData ? additionalData.active : this.isActive;
      }, UtilsService.handleValidationError.bind(this, this));
  }

  public search() {
    return;
  }
}
