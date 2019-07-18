import { Component, AfterContentInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'beta-terms',
  templateUrl: '../../../components/login/beta-terms/beta-terms.html',
})

export class BetaTerms {

  public brand = environment.Brand;

  constructor(
    public dialogRef: MatDialogRef<BetaTerms>,
  ) { }

  public close(confirmed): void {
    if (confirmed) {
      this.dialogRef.close(confirmed ? 'accepted' : 'canceled');
    }
  }
}
