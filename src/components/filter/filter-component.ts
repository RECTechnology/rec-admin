import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { TxFilter } from './filter';
import { WalletService } from '../../services/wallet/wallet.service';
// import { EventEmitter } from 'events';

@Component({
  selector: 'tx-filters',
  styles: [
    `:host{ width: 100% }`,
  ],
  templateUrl: './filter-component.html',
})

export class FilterComponent {

  @Input() public filter: TxFilter;
  @Input() public dateFrom: TxFilter;
  @Output() public dateFromChanged: EventEmitter<any>;
  @Input() public dateTo: TxFilter;
  @Output() public dateToChanged: EventEmitter<any>;
  constructor(
    private ws: WalletService,
  ) {
    this.dateFromChanged = new EventEmitter();
    this.dateToChanged = new EventEmitter();
  }

  public changedDate(type, event) {
    if (type === 'from') {
      this.dateFromChanged.emit(event.target.value);
    } else if (type === 'to') {
      this.dateToChanged.emit(event.target.value);
    }
  }

  public trackByFn(i) {
    return i;
  }
}
