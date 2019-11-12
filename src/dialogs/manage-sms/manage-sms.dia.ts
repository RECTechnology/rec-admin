import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../services/user.service';
import BaseDialog from '../../bases/dialog-base';

@Component({
  selector: 'manage-sms',
  templateUrl: './manage-sms.html',
})

export class ManageSms extends BaseDialog {
  public user: any = {};
  public code: any = {
    code: '',
    phone: '',
    prefix: '',
    tries: 0,
  };

  constructor(
    public dialogRef: MatDialogRef<ManageSms>,
    private us: UserService,
  ) {
    super();
  }
}
