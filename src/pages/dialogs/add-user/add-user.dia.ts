import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { MySnackBarSevice } from '../../../bases/snackbar-base';
import BaseDialog from '../../../bases/dialog-base';

@Component({
  selector: 'add-user',
  templateUrl: './add-user.html',
})

export class AddUser extends BaseDialog {
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
    public dialogRef: MatDialogRef<AddUser>,
    public snackBar: MySnackBarSevice,
    private us: UserService,
  ) {
    super();
  }

  public addUser(newUser) {
    this.loading = true;
    if (!newUser) {
      this.us.addUserToAccount(this.group_id, this.existingUser.email, this.existingUser.role)
        .subscribe(
          (resp) => {
            this.loading = false;
            this.close();
            this.snackBar.open('Added user correctly', 'ok', {
              duration: 2000,
            });
          },
          (error) => {
            this.error = error.message;
            setTimeout((x) => this.error = '', 3e3);
            this.loading = false;
          },
        );
    }
    if (newUser) {
      this.newUser.group_id = this.us.getGroupId();
      this.us.createAndAddUser(this.newUser)
        .subscribe(
          (resp) => {
            this.loading = false;
            this.close();
            this.snackBar.open('Created user correctly', 'ok', {
              duration: 2000,
            });
          },
          (error) => {
            this.error = error.message;
            setTimeout((x) => this.error = '', 3e3);
            this.loading = false;
          },
        );
    }
  }

  public changeRole(newRole) {
    this.newUser.role = newRole;
  }
}
