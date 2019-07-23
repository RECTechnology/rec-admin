import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Sort, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { PageBase } from '../../bases/page-base';
import { LoginService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils/utils.service';
import { ControlesService } from '../../services/controles/controles.service';
import { CsvUpload } from './components/csv-upload/csv-upload.dia';
import { CompanyService } from '../../services/company/company.service';
import { MySnackBarSevice } from '../../bases/snackbar-base';
import { AdminService } from '../../services/admin/admin.service';
import { ConfirmationMessage } from '../../components/dialogs/confirmation-message/confirmation.dia';
import { ActivateResume } from './components/activate-resume/activate-resume.dia';

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
    public dialog: MatDialog,
    public snackbar: MySnackBarSevice,
  ) {
    super();
  }

  public async ngOnInit() {
    this.search();
  }

  public search(query?: string) {
    this.loadingList = true;
    this.adminService.getChangeDelegateList()
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
        this.snackbar.open(error._body.message, 'ok');
        this.loadingList = false;
      });
  }

  public navigateToChange(id) {
    this.router.navigate(['/change_delegate/' + id]);
  }

  public newChange(schedule) {
    this.adminService.createChangeDelegate(schedule)
      .subscribe((resp) => {
        this.snackbar.open('DELEGATE_CHANGE_CREATED', 'ok');
        this.search();
      }, (error) => {
        this.snackbar.open(error._body.message, 'ok');
      });
  }

  public newImport(change) {
    const dialogRef = this.dialog.open(CsvUpload);
    dialogRef.afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.adminService.sendChangeDelegateCsv(resp, change.id)
            .subscribe((respDelegate) => {
              this.snackbar.open(respDelegate.message, 'ok');
              this.search();
            }, (error) => {
              if (error._body.message.includes('Validation error')) {
                this.validationErrors = error._body.data;
              } else {
                this.snackbar.open(error._body.message, 'ok');
              }
            });
        }
      });
  }

  public openDeleteChange(change) {
    const dialogRef = this.dialog.open(ConfirmationMessage);

    dialogRef.componentInstance.status = 'error';
    dialogRef.componentInstance.title = 'Remove Delegated Changed';
    dialogRef.componentInstance.message = 'Are you sure you want to remove delegated change:' + change.id + '?';
    dialogRef.componentInstance.btnConfirmText = 'DELETE';

    return dialogRef.afterClosed();
  }

  public deleteChange(change) {
    this.openDeleteChange(change)
      .subscribe((resp) => {
        if (resp) {
          this.adminService.deleteChangeDelegate(change.id)
            .subscribe(() => {
              this.snackbar.open('DELEGATE_CHANGE_DELETED', 'ok');
              this.search();
            }, (error) => {
              this.snackbar.open(error._body.message, 'ok');
            });
        }
      }, (err) => { return; });

  }

  public activateChange(change) {
    const dialogRef = this.dialog.open(ActivateResume);
    dialogRef.componentInstance.change = change;

    dialogRef.afterClosed()
      .subscribe((resp) => {
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
