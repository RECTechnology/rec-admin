import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';

@Component({
  selector: 'show-movements',
  templateUrl: './show-movements.html',
})
export class ShowMovements extends BaseDialog implements OnInit {
  public account: any = {};
  constructor(
    public dialogRef: MatDialogRef<ShowMovements>,
    private us: UserService,
  ) {
    super();
  }

  public ngOnInit() {
    return;
  }
}
