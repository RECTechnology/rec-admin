import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { MySnackBarSevice } from '../../../bases/snackbar-base';
import BaseDialog from '../../../bases/dialog-base';
import { environment } from '../../../environments/environment';
import { SmsService } from '../../../services/sms/sms.service';
import { ConfirmationMessage } from '../../../components/dialogs/confirmation-message/confirmation.dia';
import { ManageSms } from '../manage-sms/manage-sms.dia';
import { CompanyService } from '../../../services/company/company.service';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
  providers: [SmsService],
  selector: 'view-details',
  templateUrl: './view-details.html',
})
export class ViewDetails extends BaseDialog implements OnInit {
  public user: any = {};
  public parent: any;
  public Brand: any = environment.Brand;
  constructor(
    public dialogRef: MatDialogRef<ViewDetails>,
    public snackBar: MySnackBarSevice,
    public sms: SmsService,
    public compService: CompanyService,
    public adminService: AdminService,
    private us: UserService,
    public dialog: MatDialog,
  ) {
    super();
  }

  public editRoles() {
    this.parent.openEditUser(this.user, 0);
  }

  public getPhone() {
    return (this.user.prefix ? '+' + this.user.prefix + ' ' : '') + this.user.phone;
  }

  public confirm(title, message, customBtnText = null, customBtn = true) {
    const ref = this.dialog.open(ConfirmationMessage);
    ref.componentInstance.opts = {
      customBtn,
      customBtnClick: () => {
        ref.componentInstance.close(true);
      },
      customBtnText,
    };

    ref.componentInstance.title = title;
    ref.componentInstance.message = message;
    ref.componentInstance.btnConfirmText = 'Close';
    return ref.afterClosed();
  }

  public openManageSms(code) {
    const ref = this.dialog.open(ManageSms);
    ref.componentInstance.user = this.user;
    ref.componentInstance.code = code;
    return ref.afterClosed();
  }

  public viewSMSCode() {
    this.sms.check(this.user.id)
      .subscribe((resp) => {
        this.openManageSms(resp);
      }, (error) => {
        return;
      });
  }

  public resendSMSCode() {
    this.confirm(
      'Resend SMS Code',
      'Are you sure you want to resend sms to: <code>' + this.getPhone() + '</code>',
      'Resend',
    ).subscribe((resp) => {
      if (resp) {
        this.sms.resend(this.user.id)
          .subscribe((resend) => {
            this.snackBar.open('Re-Sent sms to number: ' + this.getPhone(), 'ok');
          }, (error) => {
            console.log(error);
            this.snackBar.open('Error re-sending: ' + error, 'ok');
          });
      }
    });
  }

  public disableUser() {
    this.confirm(
      'Disable User',
      'Are you sure you want to disable user: <code>' + this.user.id + '</code>',
      'Disable',
    ).subscribe((resp) => {
      if (resp) {
        this.adminService.deactiveUser(this.user.id)
          .subscribe((deactive) => {
            this.snackBar.open('Disabled user: ' + this.user.id, 'ok');
          }, (error) => {
            this.snackBar.open('Error disabling user: ' + error, 'ok');
          });
      }
    });
  }

  public enableUser() {
    this.confirm(
      'Disable User',
      'Are you sure you want to disable user: <b>' + this.user.id + '</b>',
      'Enable',
    ).subscribe((resp) => {
      if (resp) {
        this.adminService.activeUser(this.user.id)
          .subscribe((active) => {
            this.snackBar.open('Enabled user: ' + this.user.id, 'ok');
          }, (error) => {
            this.snackBar.open('Error enabling user: ' + error, 'ok');
          });
      }
    });
  }

  public resetSMSCode() {
    this.confirm(
      'Reset SMS Code',
      'Are you sure you want to reset the code for phone: <code>' + this.getPhone() + '</code>',
      'Resend',
    ).subscribe((resp) => {
      if (resp) {
        this.sms.reset(this.user.id)
          .subscribe((reset) => {
            this.snackBar.open('Re-Setting sms for number: ' + this.getPhone(), 'ok');
          }, (error) => {
            this.snackBar.open('Error re-setting: ' + error, 'ok');
          });
      }
    });
  }

  public validatePhone() {
    this.confirm(
      'Validate Phone',
      'Are you sure you want to validate phone: <code>' + this.getPhone() + '</code>',
      'Validate',
    ).subscribe((resp) => {
      if (resp) {
        this.sms.validate(this.user.id)
          .subscribe((valid) => {
            this.snackBar.open('Validated user with number: ' + this.getPhone(), 'ok');
          }, (error) => {
            this.snackBar.open('Error validating: ' + error, 'ok');
          });
      }
    });
  }

  public ngOnInit() {
    const tmp = this.user.roles;
    this.user.roles = [];

    for (const key in tmp) {
      if (key) {
        this.user.roles.push(tmp[key]);
      }
    }
  }
}
