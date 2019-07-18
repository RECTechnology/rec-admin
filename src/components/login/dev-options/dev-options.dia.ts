import { Component, AfterContentInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'dev-options',
  templateUrl: '../../../components/login/dev-options/dev-options.html',
})
export class DevOptions {
  public Brand: any = environment.Brand;
  constructor(
    public dialogRef: MatDialogRef<DevOptions>,
  ) { }

  public close(confirmed?): void {
    this.dialogRef.close(confirmed);
  }
}
