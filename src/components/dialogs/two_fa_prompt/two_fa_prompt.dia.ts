import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CurrenciesService } from '../../../services/currencies/currencies.service';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';

@Component({
  selector: 'two_fa_prompt',
  templateUrl: '../../../components/dialogs/two_fa_prompt/two_fa_prompt.html',
})
export class TwoFaDia extends BaseDialog {

  public code = '';
  public has2FAActivated = false;
  public sentOTP = false;
  public date_timestamp: any;

  constructor(
    public dialogRef: MatDialogRef<TwoFaDia>,
    public us: UserService,
  ) {
    super();
    this.has2FAActivated = this.us.userData.two_factor_authentication;
  }

  public close(confirmed?): void {
    this.dialogRef.close({ code: this.code, confirmed });
  }

  public sendOTP() {
    this.loading = true;
    this.disabled = true;
    this.us.sendOneTimePin()
      .subscribe(
        (resp) => {
          this.disabled = false;
          this.loading = false;
          this.sentOTP = true;
        },
        (error) => {
          this.error = error._body.message;
          this.disabled = false;
          this.loading = false;
          this.sentOTP = false;
        },
      );
  }
}
