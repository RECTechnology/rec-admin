import { Component } from '@angular/core';
import { MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { UserService } from '../../../../services/user.service';
import { MySnackBarSevice } from '../../../../bases/snackbar-base';
import { TwoFaDia } from '../../../../components/dialogs/two_fa_prompt/two_fa_prompt.dia';

@Component({
  selector: 'change-password',
  templateUrl: '../../../../pages/profile/dialogs/change-password/change-password.html',
})
export class ChangePassword {
  public message = '';
  private old_pass = '';
  private new_pass = '';
  private repeat_new_pass = '';
  private error = '';
  private loading = false;

  constructor(
    public dialogRef: MatDialogRef<ChangePassword>,
    private us: UserService,
    private snackbar: MySnackBarSevice,
    public dialog: MatDialog,
  ) { }

  public async changePassword() {
    if (this.new_pass !== this.repeat_new_pass) {
      this.error = 'Passwords do not match';
    } else {
      this.loading = true;
      this.us.updateProfile({
        old_password: this.old_pass,
        password: this.new_pass,
        repassword: this.repeat_new_pass,
      }).subscribe(
        (resp) => {
          this.loading = false;
          this.snackbar.open('Changed password correctly. Please login again', 'ok', {
            duration: 3500,
          });
          this.us.logout();
          this.close();
        },
        (error) => {
          this.error = error._body.message;
          setTimeout((_) => this.error = '', 5000);
          this.loading = false;
        },
      );
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
