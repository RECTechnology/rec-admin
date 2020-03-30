import { Input, Output, EventEmitter, Directive } from '@angular/core';

@Directive()
export class BaseBtnComponent {
  @Input() public icon: string;
  @Input() public class: string;
  @Input() public matTooltip: string;
  @Input() public color: string;
  @Input() public disabled: boolean;
  @Input() public routerLink: string;

  @Output() public clickChange: EventEmitter<any> = new EventEmitter();

  public clicked() {
    this.clickChange.emit();
  }
}
