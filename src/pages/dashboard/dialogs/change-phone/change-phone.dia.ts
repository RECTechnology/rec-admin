import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../services/user.service';
import BaseDialog from '../../../../bases/dialog-base';

@Component({
  selector: 'change-phone',
  templateUrl: './change-phone.html',
})
export class ChangePhone extends BaseDialog implements OnInit {
  public user: any = {};
  constructor(
    public dialogRef: MatDialogRef<ChangePhone>,
    public us: UserService,
  ) {
    super();
  }

  public ngOnInit() {
    return;
  }
  public changePhone() {
    return;
  }
}
