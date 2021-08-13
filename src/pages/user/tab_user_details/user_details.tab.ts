import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EditUserData } from 'src/dialogs/management/edit-user/edit-user.dia';
import { ManageSms } from 'src/dialogs/management/manage-sms/manage-sms.dia';
import { ConfirmationMessage } from 'src/dialogs/other/confirmation-message/confirmation.dia';
import { environment } from 'src/environments/environment';
import { AdminService } from 'src/services/admin/admin.service';

import { AlertsService } from 'src/services/alerts/alerts.service';
import { CompanyService } from 'src/services/company/company.service';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { SmsService } from 'src/services/sms/sms.service';
import { UtilsService } from 'src/services/utils/utils.service';

@Component({
  providers: [SmsService],
  selector: 'user-details-tab',
  templateUrl: './tab_user_details.html',
})
export class UserDetailsTab implements OnInit {
  public user: any = {};
  public user_id = null;
  public parent: any;
  public Brand: any = environment.Brand;

  constructor(
    private route: ActivatedRoute,
    public sms: SmsService,
    public compService: CompanyService,
    public adminService: AdminService,
    public dialog: MatDialog,
    public alerts: AlertsService,
    public utils: UtilsService,
    public usersCrud: UsersCrud,
    public companyService: CompanyService,
  ) {}

  public ngOnInit() {
    this.route.params.subscribe((params) => {
      this.user_id = params.id;
    });
    this.getUser();

    const tmp = this.user.roles;
    this.user.roles = [];

    for (const key in tmp) {
      if (key) {
        this.user.roles.push(tmp[key]);
      }
    }
  }

  private processRoles() {
    const tmp = this.user.roles;
    this.user.roles = [];

    for (const key in tmp) {
      if (key) {
        this.user.roles.push(tmp[key]);
      }
    }
  }

  public getUser() {
    this.usersCrud.find(this.user_id).subscribe((res) => {
      this.user = res.data;
      this.processRoles();
    });
  }

  public editRoles() {
    this.openEditUser(this.user, 0);
  }
  public openEditUser(user, i) {
    this.alerts
      .openModal(EditUserData, {
        user,
      })
      .subscribe((result) => {});
  }
  public getPhone() {
    return (this.user.prefix ? '+' + this.user.prefix + ' ' : '') + this.user.phone;
  }

  public confirm(title, message, data: any, customBtnText = null, customBtn = true) {
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
    ref.componentInstance.data = data;
    ref.componentInstance.btnConfirmText = 'Close';
    ref.componentInstance.confirmBtnShown = false;
    return ref.afterClosed();
  }

  public openManageSms(code) {
    const ref = this.dialog.open(ManageSms);
    ref.componentInstance.user = this.user;
    ref.componentInstance.code = code;
    return ref.afterClosed();
  }

  public viewSMSCode() {
    this.sms.check(this.user.id).subscribe(
      (resp) => {
        this.openManageSms(resp);
      },
      (error) => {
        return;
      },
    );
  }

  public resendSMSCode() {
    this.confirm('RESEND_SMS_CODE', 'SURE_RESEND_SMS', { phone: this.getPhone() }, 'RESEND').subscribe((resp) => {
      if (resp) {
        this.sms.resend(this.user.id).subscribe(
          (resend) => {
            this.alerts.showSnackbar('Re-Sent sms to number: ' + this.getPhone(), 'ok');
          },
          (error) => {
            this.alerts.showSnackbar('Error re-sending: ' + error, 'ok');
          },
        );
      }
    });
  }

  public disableUser() {
    this.confirm('DISABLE_USER', 'SURE_DISABLE_USER', { user: this.user.id }, 'Disable').subscribe((resp) => {
      if (resp) {
        this.adminService.deactiveUser(this.user.id).subscribe(
          (deactive) => {
            this.alerts.showSnackbar('Disabled user: ' + this.user.id, 'ok');
            this.user.enabled = false;
          },
          (error) => {
            this.alerts.showSnackbar('Error disabling user: ' + error, 'ok');
          },
        );
      }
    });
  }

  public enableUser() {
    this.confirm('ENABLE_USER', 'SURE_ENABLE_USER', { user: this.user.id }, 'ENABLE').subscribe((resp) => {
      if (resp) {
        this.adminService.activeUser(this.user.id).subscribe(
          (active) => {
            this.alerts.showSnackbar('Enabled user: ' + this.user.id, 'ok');
            this.user.enabled = true;
          },
          (error) => {
            this.alerts.showSnackbar('Error enabling user: ' + error, 'ok');
          },
        );
      }
    });
  }

  public resetSMSCode() {
    this.confirm(
      'Reset SMS Code',
      'Are you sure you want to reset the code for phone: <code>' + this.getPhone() + '</code>',
      {},
      'RESEND',
    ).subscribe((resp) => {
      if (resp) {
        this.sms.reset(this.user.id).subscribe(
          (reset) => {
            this.alerts.showSnackbar('Re-Setting sms for number: ' + this.getPhone(), 'ok');
          },
          (error) => {
            this.alerts.showSnackbar('Error re-setting: ' + error, 'ok');
          },
        );
      }
    });
  }

  public validatePhone() {
    this.confirm('VALIDATE_PHONE', 'SURE_VALIDATE_PHONE', { phone: this.getPhone() }, 'VALIDATE').subscribe((resp) => {
      if (resp) {
        this.sms.validate(this.user.id).subscribe(
          (valid) => {
            this.alerts.showSnackbar('Validated user with number: ' + this.getPhone(), 'ok');
          },
          (error) => {
            this.alerts.showSnackbar('Error validating: ' + error, 'ok');
          },
        );
      }
    });
  }



  private removeUser(user) {
    this.compService.removeUserFromSystem(user.id).subscribe(
      (resp) => {
        this.alerts.showSnackbar('Deleted user from system', 'ok');
      },
      (error) => {
        this.alerts.showSnackbar('Error deleting user: ' + error.message, 'ok');
      },
    );
  }
}
