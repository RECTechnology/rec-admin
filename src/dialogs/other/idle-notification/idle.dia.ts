import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'idle',
  templateUrl: './idle.html',
})

export class IdleNotification {
  constructor(
    public dialogRef: MatDialogRef<IdleNotification>,
    public utils: UtilsService,
  ) { }

  public resetCounter() {
    this.utils._idleSecondsCounter = 0;
    localStorage.setItem('session_status', 'active');
    this.close();
  }

  public close(e?): void {
    this.utils._idleSecondsCounter = 0;
    localStorage.setItem('session_status', 'active');
    this.dialogRef.close();
  }
}
