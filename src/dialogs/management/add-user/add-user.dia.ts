import { AdminService } from 'src/services/admin/admin.service';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
  selector: 'add-user',
  templateUrl: './add-user.html',
})

export class AddUserDia extends BaseDialog {
  public newUser: any = {
    role: 'ROLE_READONLY',
  };
  public existingUser: any = {
    role: 'ROLE_READONLY',
  };
  public roles = [
    'ROLE_ADMIN',
    'ROLE_READONLY',
    'ROLE_WORKER',
    'ROLE_SUPER_ADMIN',
  ];
  public group_id;
  public error = '';
  public showCreateNewUser = true;
  public addReseller = true;

  constructor(
    public dialogRef: MatDialogRef<AddUserDia>,
    private us: UserService,
    public alerts: AlertsService,
    public adminService: AdminService,
  ) {
    super();
  }

  public addUser(newUser) {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const onSuccess = (action) => (resp) => {
      this.loading = false;
      this.close();
      this.alerts.showSnackbar(action + ' user correctly', 'ok', {
        duration: 2000,
      });
    };

    const onFail = () => (error) => {
      this.error = error.message;
      this.loading = false;
      setTimeout((x) => this.error = '', 3e3);
    };

    if (!newUser) {
      this.adminService.addUserToAccount(this.group_id, this.existingUser.email, this.existingUser.role)
        .subscribe(onSuccess('Edited'), onFail());
    }
    if (newUser) {
      this.newUser.group_id = this.us.getGroupId();
      this.adminService.createAndAddUser(this.us.getGroupId(), this.newUser)
        .subscribe(onSuccess('Edited'), onFail());
    }
  }

  public changeRole(newRole) {
    this.newUser.role = newRole;
  }
}
