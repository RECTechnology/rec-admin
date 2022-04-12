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
import { DatePipe } from '@angular/common';
import { SendTransactionsDia } from './send_transaction_modal/send_transactions_modal';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'new-massive-transactions',
  templateUrl: './new_massive_transactions.html',
  styleUrls: ['./new_massive_transactions.scss']
})
export class NewMassiveTransactionsComponent extends PageBase {
  public pageName = 'New Massive Transactions';
  public delegate: any = {};
  public idOrNew = null;
  public isNew = true;
  public readonly = false;
  public dateScheduled = '';
  public timeScheduled = '';
  public transactions_name = '';
  public dataPassed = false;
  public sortedData = [];
  public dataLoading = true;
  public generatingReport = false;
  public status = '';
  public totalImport = 0;
  public successTx: any;
  public totalImportSended: any;
  public pendientTx: any;
  public scheduleAt;
  public failedTx: any;
  public warnings: any;
  public scheduleDelivery = false;
  public scheduleDeliveryDate: String;
  public limit = 72;
  public isEditName = false;
  public type: any;
  scheduleDeliveryDateCopy: String;
  public formGroup = new FormGroup({
    transactions_name: new FormControl("", Validators.maxLength(this.limit))
  })

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
    public translate: TranslateService,


  ) {
    super();
  }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.idOrNew = params.id_or_new;
      this.isNew = this.idOrNew === 'new';
      this.status = params.status;
      if (!this.isNew) {
        this.syncData();
      }
    });

  }

  public syncData() {
    this.getDelegate();
    this.getDelegateData();
  }

  public changeDate(event) {
    var dateSupport: Date = new Date(event);
    var datepipe: DatePipe = new DatePipe('es');
    this.scheduleDeliveryDate = datepipe.transform(dateSupport, 'yyyy-MM-ddThh:mm:ss-SS');
  }

  public canUploadFile() {
    return this.delegate.status == 'created' 
  }


  public getDelegate() {
    this.changeCrud.find(this.idOrNew).subscribe((resp) => {
      this.totalImport = 0;
      this.delegate = resp.data;
      for (let item of this.delegate.data) {
        this.totalImport = this.totalImport + item.amount;
      }
      this.totalImportSended = this.delegate.statistics.result.issued_rec ?? 0;
      this.successTx = this.delegate.statistics.result.success_tx ?? 0;
      this.failedTx = this.delegate.statistics.result.failed_tx ?? 0;
      this.pendientTx = this.delegate.data.length - this.delegate.statistics.result.success_tx ?? 0;
      this.failedTx = this.delegate.statistics.result.failed_tx ?? 0;
      this.warnings = this.delegate.statistics.scheduled.warnings ?? 0;
      this.scheduleAt = this.delegate.scheduled_at ?? 'YYYY-MM-DD HH:MM';
      this.status = this.delegate.status ?? 'noStatus';
      this.transactions_name = this.delegate.name;
      this.type = this.delegate.type;
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

  public saveEditConcept() {
    if(this.formGroup.invalid){
      return;
    }
    this.changeCrud.editConcept(this.idOrNew, this.transactions_name).subscribe((resp) => {
      this.alerts.showSnackbar("EDITED_CONCEPT");
    });
    this.changeIsEditName();
  }

  public changeIsEditName() {
    this.isEditName = !this.isEditName


  }

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = this.limit * $event.pageIndex;
    this.getDelegateData();
  }
  

  public goToLog() {
    this.router.navigate([]).then(result => {
      window.open('/txs_blocks/massive/' + this.idOrNew + '/logs?id=' + this.idOrNew, '_blank');
    })
  }

  public openSendTxsModal() {

    if (this.scheduleDelivery) {
      this.scheduleDeliveryDateCopy = this.scheduleDeliveryDate;
    } else {
      this.changeDate(null);
      this.scheduleDeliveryDateCopy = null;
      var datepipe: DatePipe = new DatePipe('es');
      this.scheduleDeliveryDate = datepipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss-SS');

    }
    this.alerts.openModal(SendTransactionsDia, {
      totalTransactions: this.total,
      sendType: this.type,
      totalImport: this.totalImport,
      dateSend: this.scheduleDeliveryDateCopy,
      concept: this.transactions_name
    }).subscribe((send) => {
      if (send) {
        this.changeCrud.startTransactions(this.delegate.id, {
          status: 'scheduled',
          scheduled_at: this.scheduleDeliveryDate

        }).subscribe()
      }
    });
  }

  public sendCancel() {
    this.changeCrud.changeStatus(this.idOrNew, 'draft')
  }

  public sendRetry() {
    this.changeCrud.changeStatus(this.idOrNew, 'scheduled')
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
            this.syncData();
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
