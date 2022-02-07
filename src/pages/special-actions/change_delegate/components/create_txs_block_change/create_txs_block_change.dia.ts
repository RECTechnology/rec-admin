import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import BaseDialog from 'src/bases/dialog-base';

export type DelegateChangeType = 'delegated_change' | 'massive_transactions';
export interface NewDelegateChange {
  schedule: string;
  name: string;
  type: DelegateChangeType;
}

@Component({
  selector: 'edit-accounts',
  styleUrls: ['./create_txs_block_change.css'],
  templateUrl: './create_txs_block_change.html',
})
export class CreateTXsBlockChange extends BaseDialog {
  public schedule = null;
  public date = null;
  public time = null;
  public name: string = null;
  public delegateType: DelegateChangeType = 'massive_transactions';
  public TYPES: DelegateChangeType[] = ['massive_transactions','delegated_change' ];

  @Output('onNewChange') public onNewChange: EventEmitter<NewDelegateChange>;

  constructor(public dialogRef: MatDialogRef<CreateTXsBlockChange>) {
    super();
  }

  public newChange() {
    if (this.time && this.date) {
      this.schedule = new Date(this.date + ' ' + this.time).toISOString();
    }

    this.close({
      schedule: this.schedule,
      type: this.delegateType,
      name: this.name,
    });
  }
}
