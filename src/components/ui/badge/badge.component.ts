import { Component, Input } from '@angular/core';

@Component({
  selector: 'badge',
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  @Input() public value: any = '';
  @Input() public label: any = '';
  @Input() public color: any = 'blue';
}
