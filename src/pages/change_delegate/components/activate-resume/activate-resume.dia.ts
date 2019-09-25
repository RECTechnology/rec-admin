import { Component, OnInit } from '@angular/core';
import { MatDialogRef, Sort } from '@angular/material';
import BaseDialog from '../../../../bases/dialog-base';
import { CompanyService } from '../../../../services/company/company.service';
import { UserService } from '../../../../services/user.service';
import { AdminService } from '../../../../services/admin/admin.service';
import { MySnackBarSevice } from '../../../../bases/snackbar-base';
import { UtilsService } from '../../../../services/utils/utils.service';
import { DelegatedChangesCrud } from 'src/services/crud/delegated_changes/delegated_changes';

@Component({
  selector: 'activate-resume',
  templateUrl: './activate-resume.html',
})
export class ActivateResume extends BaseDialog {
  public change: any = {};
  public datePassed: boolean = false;
  public validationErrors: any[] = [];
  public validationErrorName = '';

  constructor(
    public dialogRef: MatDialogRef<ActivateResume>,
    public company: CompanyService,
    public us: UserService,
    public adminService: AdminService,
    public snackbar: MySnackBarSevice,
    public utils: UtilsService,
    public changeCrud: DelegatedChangesCrud,
  ) {
    super();
  }

  public ngOnInit() {
    this.datePassed = this.utils.hasDatePassed(this.change.scheduled_at);
  }

  public proceed() {
    this.loading = true;
    this.changeCrud.update(this.change.id, { status: 'scheduled' })
      .subscribe((resp) => {
        this.snackbar.open('Launched delegated change', 'ok');
        this.loading = false;
        this.dialogRef.close(true);
      }, (error) => {
        if (error.message.includes('Validation error')) {
          this.validationErrors = error.errors;
          this.validationErrorName = 'Validation Error';
        } else {
          this.snackbar.open(error.message);
        }
        this.loading = false;
      });
  }

  public close(): void {
    this.dialogRef.close(false);
  }
}
