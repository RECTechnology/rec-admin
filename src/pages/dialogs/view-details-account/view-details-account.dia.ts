import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { MySnackBarSevice } from '../../../bases/snackbar-base';
import BaseDialog from '../../../bases/dialog-base';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'view-details-account',
  templateUrl: './view-details-account.html',
})
export class ViewDetailsAccount extends BaseDialog implements OnInit {
  public account: any = {};
  public parent: any;
  public Brand: any = environment.Brand;

  public address = '';

  constructor(
    public dialogRef: MatDialogRef<ViewDetailsAccount>,
    public snackBar: MySnackBarSevice,
    private us: UserService,
    public utils: UtilsService,
  ) {
    super();
  }

  public ngOnInit() {
    this.address = this.utils.constructAddressString(this.account);
  }

  public openEditAccount() {
    this.parent.openEditAccount(this.account);
  }

  public expelUser() { return; }
}
