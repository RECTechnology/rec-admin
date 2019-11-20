import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// TODO: also add button with text

@Component({
  selector: 'icon-btn',
  templateUrl: './icon-btn.component.html',
  styles: [
    `:host { display: block; }`,
  ],
})
export class IconBtnComponent {
  @Input() public icon: string;
  @Input() public class: string;
  @Input() public matTooltip: string;
  @Input() public disabled: boolean;

  @Output() public clicked: EventEmitter<any> = new EventEmitter();
}
