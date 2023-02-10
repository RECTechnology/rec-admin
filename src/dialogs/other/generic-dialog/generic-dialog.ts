import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'generic-dialog',
  templateUrl: './generic-dialog.html',
})

export class GenericDialog {

    @Input() message: string;
    @Input() title: string;
    @Input() status: string;

  constructor(public dialogRef: MatDialogRef<GenericDialog>,) { }

  public close(confirmed): void {
    this.dialogRef.close(confirmed);
  }

}