import { Component, AfterContentInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Brand } from '../../../environment/brand';

@Component({
  selector: 'data-protection',
  templateUrl: '../../../components/login/data-protection/data-protection.html',
})
export class DataProtection {
  public brand = Brand;
  public dataProtectionAccepted = false;
  public tosAccepted = false;
  public notifAccepted = false;

  constructor(
    public dialogRef: MatDialogRef<DataProtection>,
  ) { }

  public close(confirmed): void {
    const accepted = this.dataProtectionAccepted && this.tosAccepted;
    this.dialogRef.close({
      data_protection_accepted: this.dataProtectionAccepted,
      notification_accepted: this.notifAccepted,
      tos_accepted: this.tosAccepted,
    });
  }

  public decline() {
    this.dialogRef.close({
      data_protection_accepted: false,
      notification_accepted: false,
      tos_accepted: false,
    });
  }
}
