import { Component, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { InputFieldComponent } from '../input-field/input-field.component';
import { Document } from 'src/shared/entities/document.ent';
import { RecStatus } from 'src/shared/entities/rec_status.ent';

@Component({
  selector: 'status-input-field',
  templateUrl: './status-input-field.component.html',
})
export class StatusInputFieldComponent extends InputFieldComponent {

  public REC_STATUSES: RecStatus[] = [];
  public REC_COLORS = [
    'status-launched',
    'status-success',
    'status-error',
    'col-expired',
  ];
  @Input() public label: string;
  @Input() public value: any = '';

  @Output() public valueChange: EventEmitter<any> = new EventEmitter();

  public ngOnInit() {
    for (let i = 0; i < 4; i++) {
      this.REC_STATUSES.push(new RecStatus(Document.REC_STATUS_TYPES[i], this.REC_COLORS[i]),)
    }
  }

  public changed($event) {
    this.valueChange.emit(isNaN($event) ? $event : +$event);
  }

}