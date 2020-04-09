import { Component, Input } from '@angular/core';

@Component({
  selector: 'badge',
  templateUrl: './badge.component.html',
  styleUrls: [
    './badge.scss',
  ],
})
export class BadgeComponent {
  @Input() public value: any = '';
  @Input() public label: any = '';
  @Input() public color: any = 'blue';
}
