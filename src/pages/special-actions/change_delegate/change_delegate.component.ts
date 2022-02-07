import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { PageBase } from '../../../bases/page-base';
import { LoginService } from '../../../services/auth/auth.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { ControlesService } from '../../../services/controles/controles.service';
import { CsvUpload } from './components/csv-upload/csv-upload.dia';
import { CompanyService } from '../../../services/company/company.service';
import { ActivateResume } from './components/activate-resume/activate-resume.dia';
import { DelegatedChangesCrud } from 'src/services/crud/delegated_changes/delegated_changes';
import { DelegatedChangesDataCrud } from 'src/services/crud/delegated_changes/delegated_changes_data';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { NewDelegateChange } from './components/create_txs_block_change/create_txs_block_change.dia';

@Component({
  selector: 'change_delegate',
  styleUrls: ['./change_delegate.css'],
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
    public router: Router,
    public changeCrud: DelegatedChangesCrud,
    public changeDataCrud: DelegatedChangesDataCrud,
    public alerts: AlertsService,
  ) {
    super();
  }

  public ngOnInit() {
    this.search();
  }

  public search(query?: string) {
    this.loadingList = true;
    this.changeCrud
      .list({
        offset: this.offset,
        limit: this.limit,
        query,
      })
      .subscribe(
        (resp) => {
          this.delegateChanges = resp.data.elements.map((el) => {
            el.data = [];
            return el;
          });

          this.total = resp.data.total;
          this.sortedData = this.delegateChanges.slice();
          this.loadingList = false;
        },
        (error) => {
          this.alerts.showSnackbar(error.message, 'ok');
          this.loadingList = false;
        },
      );
  }

  public navigateToChange(change: any) {
    if (change.type == 'delegated_change') {
      this.router.navigate(['/txs_blocks/delegate/' + change.id], {
        queryParams: { status: change.status },
        queryParamsHandling: 'merge',
      });
    }
    if (change.type == 'massive_transactions') {
      this.router.navigate(['/txs_blocks/massive/' + change.id],{
        queryParams: { status: change.status },
        queryParamsHandling: 'merge',
      });
    }
  }

  public newChange({ schedule, type, name }: NewDelegateChange) {
    this.changeCrud.create({ scheduled_at: schedule, type, name }).subscribe((resp) => {
      this.alerts.showSnackbar('DELEGATE_CHANGE_CREATED', 'ok');
      this.navigateToChange(resp.data);
    }, this.alerts.observableErrorSnackbar);
  }

  public newImport(change) {
    this.alerts.openModal(CsvUpload).subscribe((resp) => {
      if (resp) {
        this.changeDataCrud
          .importFromCSV({
            delegated_change_id: change.id,
            path: resp,
          })
          .subscribe((respDelegate) => {
            this.alerts.showSnackbar(respDelegate.message, 'ok');
            this.search();
          }, this.handleValidationError);
      }
    });
  }

  public openDeleteChange(change) {
    return this.alerts.showConfirmation(
      'SURE_DELETE_TXT_BLOCK',
      {changeId:change.id},
     
      'DELETE_TXT_BLOCK',
      { btnConfirmText: 'Delete' },
    );
  }

  public deleteChange(change) {
    this.openDeleteChange(change).subscribe((resp) => {
      if (resp) {
        this.changeCrud.remove(change.id).subscribe(() => {
          this.alerts.showSnackbar('DELEGATE_CHANGE_DELETED', 'ok');
          this.search();
        }, this.handleValidationError);
      }
    });
  }

  public activateChange(change) {
    return this.alerts.openModal(ActivateResume, { change }).subscribe(() => this.search());
  }

  public cancelChange(change) {
    this.changeCrud.update(change.id, { status: 'draft' }).subscribe(
      (res) => {
        this.alerts.showSnackbar('Delegated change deactivated', 'ok');
        this.search();
      },
      (err) => {
        if (err.message.includes('Validation error')) {
          this.validationErrors = err.errors;
          this.validationErrorName = 'Validation Error';
        } else {
          this.alerts.showSnackbar(err.message);
        }
      },
    );
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
    this.offset = this.limit * $event.pageIndex;
    this.search();
  }
}
