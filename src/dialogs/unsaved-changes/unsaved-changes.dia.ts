import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import BaseDialog from '../../bases/dialog-base';

@Component({
  selector: 'unsaved-changes',
  templateUrl: './unsaved-changes.html',
})

export class UnsavedChangesDialog extends BaseDialog {

  public title = 'Untitled';

  constructor(
    public dialogRef: MatDialogRef<UnsavedChangesDialog>,
    private us: UserService,
  ) {
    super();
  }

  public save() {
    this.dialogRef.close('save');
  }

  public discard() {
    this.dialogRef.close('discard');
  }

  public continue() {
    this.dialogRef.close('continue');
  }
}
