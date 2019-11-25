import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Sort } from '@angular/material';
import { Router } from '@angular/router';
import { PageBase } from '../../../bases/page-base';
import { LoginService } from '../../../services/auth/auth.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { ControlesService } from '../../../services/controles/controles.service';
import { CsvUpload } from './components/csv-upload/csv-upload.dia';
import { CompanyService } from '../../../services/company/company.service';
import { AdminService } from '../../../services/admin/admin.service';
import { ActivateResume } from './components/activate-resume/activate-resume.dia';
import { DelegatedChangesCrud } from 'src/services/crud/delegated_changes/delegated_changes';
import { DelegatedChangesDataCrud } from 'src/services/crud/delegated_changes/delegated_changes_data';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
  selector: 'change_delegate',
  styleUrls: [
    './change_delegate.css',
  ],
  templateUrl: './change_delegate.html',
})
export class ChangeDelegateComponent extends PageBase implements OnInit {
  public pageName = 'Change Delegate';
  public status = null;

  public delegateChanges: any[] = [];
  public sortedData: any[] = [];
  public sortID: string = 'id';
  public sortDir: string = 'desc';

  public offset = 0;
  public limit = 10;
  public total = 0;

  public validationErrors: any[] = [];
  public loadingList = true;

  constructor(
    public titleService: Title,
    public ls: LoginService,
    public utils: UtilsService,
    public controles: ControlesService,
    public company: CompanyService,
    public adminService: AdminService,
    public router: Router,
    public changeCrud: DelegatedChangesCrud,
    public changeDataCrud: DelegatedChangesDataCrud,
    public alerts: AlertsService,
  ) {
    super();
  }

  public async ngOnInit() {
    this.search();
  }

  public search(query?: string) {
    this.loadingList = true;
    this.changeCrud.list()
      .subscribe((resp) => {
        this.delegateChanges = resp.data.elements
          .map((el) => {
            el.data = [];
            return el;
          });

        this.total = resp.data.total;
        this.sortedData = this.delegateChanges.slice();
        this.loadingList = false;
      }, (error) => {
        this.alerts.showSnackbar(error.message, 'ok');
        this.loadingList = false;
      });
  }

  public navigateToChange(id) {
    this.router.navigate(['/change_delegate/' + id]);
  }

  public newChange(schedule) {
    this.changeCrud.create({ scheduled_at: schedule })
      .subscribe((resp) => {
        this.alerts.showSnackbar('DELEGATE_CHANGE_CREATED', 'ok');
        this.router.navigate(['/change_delegate/' + resp.data.id]);
        // this.search();
      }, (error) => {
        this.alerts.showSnackbar(error.message, 'ok');
      });
  }

  public newImport(change) {
    this.alerts.openModal(CsvUpload)
      .subscribe((resp) => {
        if (resp) {
          this.changeDataCrud.importFromCSV({
            delegated_change_id: change.id,
            path: resp,
          }).subscribe((respDelegate) => {
            this.alerts.showSnackbar(respDelegate.message, 'ok');
            this.search();
          }, (error) => {
            if (error.message.includes('Validation error')) {
              this.validationErrors = error.errors;
            } else {
              this.alerts.showSnackbar(error.message, 'ok');
            }
          });
        }
      });
  }

  public openDeleteChange(change) {
    return this.alerts.showConfirmation(
      'Are you sure you want to remove delegated change:' + change.id + '?',
      'Remove Delegated Changed',
      'DELETE',
      'error',
    );
  }

  public deleteChange(change) {
    this.openDeleteChange(change)
      .subscribe((resp) => {
        if (resp) {
          this.changeCrud.remove(change.id)
            .subscribe(() => {
              this.alerts.showSnackbar('DELEGATE_CHANGE_DELETED', 'ok');
              this.search();
            }, (error) => {
              this.alerts.showSnackbar(error.message, 'ok');
            });
        }
      }, (err) => { return; });

  }

  public activateChange(change) {
    return this.alerts.openModal(ActivateResume, { change })
      .subscribe(() => {
        this.search();
      });
  }

  public cancelChange() {
    return;
  }

  public sortData(sort: Sort): void {
    const data = this.delegateChanges.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortID = sort.active;
    this.sortDir = sort.direction.toUpperCase();
    this.search();
  }

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = this.limit * ($event.pageIndex);
    this.search();
  }
}
