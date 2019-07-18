import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { CompanyService } from '../../../services/company/company.service';
import { MySnackBarSevice } from '../../../bases/snackbar-base';
import { UtilsService } from '../../../services/utils/utils.service';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  providers: [
    CompanyService,
  ],
  selector: 'vote-withdrawal',
  templateUrl: './vote-withdrawal.html',
})
export class VoteWithdrawal {

  public withdrawal: any = {};
  public validation: any = {};
  public decision: boolean = false;
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<VoteWithdrawal>,
    public snackBar: MySnackBarSevice,
    private as: AdminService,
    public utils: UtilsService,
    public dialog: MatDialog,
  ) { }

  public ngOnInit() {
    return;
  }

  public close(user = null): void {
    this.dialogRef.close();
  }

  public vote() {
    this.as.validateWithdrawalAttempt(this.validation.id, { accepted: this.decision })
      .subscribe((resp) => {
        this.snackBar.open('Voted correctly');
        this.dialogRef.close({ vote: this.decision });
      }, (err) => {
        this.snackBar.open(err._body.message);
      });
  }
}
