import { Component } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { UserService } from '../../../../services/user.service';
import { MySnackBarSevice } from '../../../../bases/snackbar-base';
import BaseDialog from '../../../../bases/dialog-base';
declare const QRCode;

@Component({
  selector: 'activate-2fa',
  templateUrl: '../../../../pages/profile/dialogs/activate-2fa/activate-2fa.html',
})
export class Activate2FA extends BaseDialog {

  public qrcodeElement: any;
  public qrcode = '';
  public two_fa_code = '';
  public requesting = false;
  constructor(
    public dialogRef: MatDialogRef<Activate2FA>,
    private us: UserService,
    private snackbar: MySnackBarSevice,
  ) {
    super();
  }

  public generateQR() {
    setTimeout((_) => {
      const text =
        'otpauth://totp/Chip-Chap:' + this.us.userData.email +
        '?secret=' + this.qrcode + '&issuer=Chip-Chap';
      this.qrcodeElement = new QRCode(
        document.getElementById('twofa_qr'),
        {
          correctLevel: QRCode.CorrectLevel.H,
          height: 150,
          minVersion: 7,
          text,
          width: 150,
        });
    }, 100);
  }

  public requestCode() {
    this.requesting = true;
    this.us.request2faCode()
      .subscribe(
        (resp) => {
          this.qrcode = resp.two_factor_code;
          this.generateQR();
          this.requesting = false;
        },
        (error) => {
          this.requesting = false;
          this.snackbar.open('There has been an error, please try again later', 'ok');
        },
      );
  }

  public validate2fa() {
    this.requesting = true;
    this.us.validate2fa(this.two_fa_code)
      .subscribe(
        (resp) => {
          this.us.userData.two_factor_authentication = true;
          this.close(true);
        },
        (error) => {
          this.snackbar.open('There has been an error, please try again later', 'ok');
          this.requesting = false;
        },
      );
  }

  public close(resp): void {
    this.dialogRef.close(resp);
  }
}
