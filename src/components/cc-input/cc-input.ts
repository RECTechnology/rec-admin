import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cc-input',
  styles: [
    ':host{ width: 100%}',
  ],
  templateUrl: '../../components/cc-input/cc-input.html',
})
export class CCInput {
  @Input() public label = 'label';
  @Input() public value: string = '';
  @Input() public disabled: boolean = false;
  @Input() public placeholder: string = '';
  @Input() public type: string = 'text';
  @Input() public badValue: boolean = false;
  @Output() public valueChange: EventEmitter<any>;
  @Output() public onInput: EventEmitter<any>;

  constructor() {
    this.valueChange = new EventEmitter();
    this.onInput = new EventEmitter();
  }

  public changed() {
    this.valueChange.emit(this.value);
    this.onInput.emit(this.value);
  }
}

@Component({
  selector: 'cc-input-editable',
  styles: [
    ':host{ width: 100% }',
  ],
  templateUrl: '../../components/cc-input/cc-input-editable.html',
})
export class CCInputEditable extends CCInput {
  @Input() public edit: boolean = false;
  @Input() public direction: string = 'col';
  constructor() {
    super();
  }
}
