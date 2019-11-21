import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'input-field',
  templateUrl: './input-field.component.html',
})
export class InputFieldComponent {
  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public name: string;
  @Input() public value: any = null;
  @Output() public valueChange: EventEmitter<any> = new EventEmitter();
  @Input() public disabled: boolean = false;
  @Input() public type: string = 'text';

  public isNormalInput = true;

  public ngOnInit() {
    this.placeholder = this.placeholder || this.label;
    this.name = this.name || this.label;

    this.isNormalInput = [
      'text', 'number',
      'date', 'email',
      'color', 'button',
      'file', 'password',
      'image', 'tel',
    ].includes(this.type);
  }
}
