import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// TODO: also add button with text

@Component({
  selector: 'icon-btn',
  templateUrl: './icon-btn.component.html',
  styles: [
    `:host { display: inline-block; margin: 0 10px}`,
  ],
})
export class IconBtnComponent {
  @Input() public icon: string;
  @Input() public class: string;
  @Input() public matTooltip: string;
  @Input() public disabled: boolean;
  @Input() public routerLink: string;

  @Output() public clickChange: EventEmitter<any> = new EventEmitter();

  public clicked() {
    console.log('click');
    this.clickChange.emit();
  }
}
