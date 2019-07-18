import { Component, AfterContentInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CurrenciesService } from '../../../services/currencies/currencies.service';
import { Brand } from '../../../environment/brand';

@Component({
  selector: 'dev-options',
  templateUrl: '../../../components/login/dev-options/dev-options.html',
})
export class DevOptions {
  public Brand = Brand;
  constructor(
    public dialogRef: MatDialogRef<DevOptions>,
  ) { }

  public close(confirmed): void {
    this.dialogRef.close(confirmed);
  }
}
