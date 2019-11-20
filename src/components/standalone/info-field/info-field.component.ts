import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'info-field',
  templateUrl: './info-field.component.html',
  styles: [
    `:host  { display: block; width: auto; height; auto; }`,
  ],
})
export class InfoFieldComponent {
  @Input() public title: string;
  @Input() public value: string;
}
