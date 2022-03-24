import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CompanyService } from '../../services/company/company.service';
import { UtilsService } from '../../services/utils/utils.service';
import { AdminService } from '../../services/admin/admin.service';
import { AlertsService } from 'src/services/alerts/alerts.service';

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
    private as: AdminService,
    public utils: UtilsService,
    public dialog: MatDialog,
    public alerts: AlertsService,
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
        this.alerts.showSnackbar('VOTED_CORRECTLY');
        this.dialogRef.close({ vote: this.decision });
      }, (err) => {
        this.alerts.showSnackbar(err.message);
      });
  }
}
