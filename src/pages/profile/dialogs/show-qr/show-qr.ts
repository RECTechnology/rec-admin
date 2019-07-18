import { Component, AfterContentInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../../services/user.service';
import { MySnackBarSevice } from '../../../../bases/snackbar-base';
import BaseDialog from '../../../../bases/dialog-base';
declare const QRCode;

@Component({
  selector: 'show-qr',
  templateUrl: '../../../../pages/profile/dialogs/show-qr/show-qr.html',
})
export class ShowQrDia extends BaseDialog implements AfterContentInit {

  public qrcodeElement: any;
  public qrcode = '';
  public pin = '';
  public requesting = true;
  constructor(
    public dialogRef: MatDialogRef<ShowQrDia>,
    private us: UserService,
    private snackbar: MySnackBarSevice,
  ) {
    super();
  }

  public ngAfterContentInit() {
    this.requestCode();
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
    this.us.show2fa(this.pin)
      .subscribe(
        (resp) => {
          this.qrcode = resp.two_factor_code;
          this.generateQR();
          this.requesting = false;
        },
        (error) => {
          this.snackbar.open('There has been an error: ' + error._body.message, 'ok');
          this.close('invalid pin');
        },
      );
  }

  public close(msg): void {
    this.dialogRef.close(msg);
  }
}
