import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'export-sent-dialog',
  templateUrl: './export-sent.dia.html',
})
export class ExportSentDialog {
  constructor(public dialogRef: MatDialogRef<ExportSentDialog>) {}

  public close(confirmed = false): void {
    this.dialogRef.close(confirmed);
  }
}
