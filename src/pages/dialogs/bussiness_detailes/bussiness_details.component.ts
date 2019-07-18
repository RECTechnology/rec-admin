import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';
import { ControlesService } from '../../../services/controles/controles.service';
import { UserService } from '../../../services/user.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { Brand } from '../../../environment/brand';
import BaseDialog from '../../../bases/dialog-base';

@Component({
  selector: 'bussiness-details',
  styleUrls: [
    './bussiness_details.css',
  ],
  templateUrl: './bussiness_details.html',
})
export class BussinessDetailsDia extends BaseDialog implements OnInit {
  public bussiness: any = null;
  public address = '';
  public Brand = Brand;
  constructor(
    public dialogRef: MatDialogRef<BussinessDetailsDia>,
    public route: ActivatedRoute,
    public controles: ControlesService,
    public router: Router,
    public us: UserService,
    public utils: UtilsService,
  ) {
    super();
  }

  public ngOnInit() {
    if (!this.bussiness) {
      this.close();
    }
    this.address = this.utils.constructAddressString(this.bussiness);
  }

  public setUp() {
    return;
  }
}
