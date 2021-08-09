import { AlertsService } from 'src/services/alerts/alerts.service';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PageBase } from '../../../../../bases/page-base';
import { LoginService } from '../../../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../../services/utils/utils.service';
import { DelegatedChangesDataCrud } from 'src/services/crud/delegated_changes/delegated_changes_data';
import { DelegatedChangesCrud } from 'src/services/crud/delegated_changes/delegated_changes';
import { Sort } from '@angular/material/sort';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { CsvUpload } from '../csv-upload/csv-upload.dia';
import { AdminService } from 'src/services/admin/admin.service';
import { ActivateResume } from '../activate-resume/activate-resume.dia';

@Component({
  selector: 'new-massive-transactions',
  templateUrl: './new_massive_transactions.html',
})
export class NewMassiveTransactionsComponent extends PageBase {
  public pageName = 'New Massive Transactions';
  public delegate: any = {};
  public idOrNew = null;
  public isNew = true;
  public readonly = false;
  public dateScheduled = '';
  public timeScheduled = '';
  public dataPassed = false;
  public sortedData = [];
  public dataLoading = true;
  public generatingReport = false;

  constructor(
    public adminService: AdminService,
    public titleService: Title,
    public ls: LoginService,
    public route: ActivatedRoute,
    public router: Router,
    public changeCrud: DelegatedChangesCrud,
    public changeDataCrud: DelegatedChangesDataCrud,
    public utils: UtilsService,
    public snackbar: MySnackBarSevice,
    public alerts: AlertsService,
  ) {
    super();
  }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.idOrNew = params.id_or_new;
      this.isNew = this.idOrNew === 'new';

      if (!this.isNew) {
        this.getDelegate();
        this.getDelegateData();
      }
    });
  }

  public getDelegate() {
    this.changeCrud.find(this.idOrNew).subscribe((resp) => {
      this.delegate = resp.data;
      if (this.delegate.scheduled_at) {
        const date = new Date(this.delegate.scheduled_at);
        const parts = this.utils.parseDateToParts(date);

        this.dataPassed = this.utils.hasDatePassed(date);

        this.dateScheduled = parts.dateStr;
        this.timeScheduled = parts.timeStr;
        this.readonly = this.delegate.status != 'draft';
      }
    });
  }

  public getDelegateData() {
    this.dataLoading = true;
    this.changeDataCrud
      .list({
        delegated_change_id: this.idOrNew,
        order: this.sortDir,
        sort: this.sortID,
        limit: this.limit,
        offset: this.offset,
      })
      .subscribe(
        (resp) => {
          this.sortedData = resp.data.elements.map((el) => {
            el.selected = false;
            return el;
          });
          this.total = resp.data.total;
          this.dataLoading = false;
        },
        (error) => (this.dataLoading = false),
      );
  }

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = this.limit * $event.pageIndex;
    this.getDelegateData();
  }

  public sendReport() {
    this.generatingReport = true;
    this.changeCrud.sendMassiveTransactionsReport(this.idOrNew).subscribe(
      (resp) => {
        this.snackbar.open('PROCESING_REPORT');
        this.generatingReport = false;
      },
      (err) => {
        this.generatingReport = false;
        this.alerts.observableErrorSnackbar(err);
      },
    );
  }

  public newImport() {
    this.alerts.openModal(CsvUpload, {}).subscribe((resp) => {
      if (resp) {
        this.dataLoading = true;
        this.adminService.sendChangeDelegateCsv(resp, this.delegate.id).subscribe(
          (respDelegate) => {
            this.alerts.showSnackbar(respDelegate.message, 'ok');
            this.getDelegate();
            this.getDelegateData();
            this.dataLoading = false;
          },
          (error) => {
            this.dataLoading = false;
            if (error.data && error.data.length > 0) {
              this.validationErrors = error.data;
            } else {
              this.alerts.showSnackbar(error.message);
            }
          },
        );
      }
    });
  }

  public activateChange() {
    this.alerts
      .openModal(ActivateResume, {
        change: this.delegate,
      })
      .subscribe((resp) => {
        if (resp) {
          this.router.navigate(['/change_delegate']);
        }
      }, this.alerts.observableErrorSnackbar);
  }

  public sortData(sort: Sort): void {
    this.sortID = sort.active;
    this.sortDir = sort.direction.toUpperCase();
    this.getDelegateData();
  }
}
