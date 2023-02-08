import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'save-changes',
  templateUrl: './save-changes.html',
})

export class SaveChangesMessage {
  public message: string = 'SAVE_CHANGES_DESCRIPTION';
  public trailing: string;
  public status: string = 'error';
  public title: string = 'SAVE_CHANGES';
  public btnConfirmText: string = 'SAVE';
  public btnCancelText: string = 'CONTINUE_WITHOUT_SAVING';
  public headerIcon: string = 'exclamation-triangle';
  public data: any = {};
 
  public opts: any = {};
  public confirmBtnShown = true;

  constructor(
    public dialogRef: MatDialogRef<SaveChangesMessage>,
  ) { }

  

  public close(confirmed = false, action: string): void {
    const result = {confirmed, action}
    this.dialogRef.close(result);
  }
}
