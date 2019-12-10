import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TxFilter } from './filter';

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
