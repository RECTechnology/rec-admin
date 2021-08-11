import { Component, Input, EventEmitter, Output } from '@angular/core';
import { InputFieldComponent } from '../input-field/input-field.component';
import { Document } from 'src/shared/entities/document.ent';

@Component({
  selector: 'status-input-field',
  templateUrl: './status-input-field.component.html',
})
export class StatusInputFieldComponent extends InputFieldComponent {
  public REC_STATUSES = Document.REC_STATUS_TYPES;

  @Input() public label: string;
  @Input() public value: any = '';

  @Output() public valueChange: EventEmitter<any> = new EventEmitter();

  public changed($event) {
    this.valueChange.emit(isNaN($event) ? $event : +$event);
  }
}
