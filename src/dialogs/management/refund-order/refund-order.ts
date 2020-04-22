import { AdminService } from 'src/services/admin/admin.service';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
  selector: 'refund-order',
  templateUrl: './refund-order.html',
})

export class RefundOrderDia extends BaseDialog {
  public pin: string;
  public id: string;
  public loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<RefundOrderDia>,
    private us: UserService,
    public alerts: AlertsService,
    public admin: AdminService,
  ) {
    super();
  }

  public refund() {
    this.loading = true;
    this.admin.refundOrder(this.id, this.pin)
      .subscribe((resp) => {
        this.loading = false;
        this.alerts.showSnackbar('REFUNDED');
        this.close();
      }, (err) => {
        this.loading = false;
        this.alerts.showSnackbar(err.message);
      });
  }
}
