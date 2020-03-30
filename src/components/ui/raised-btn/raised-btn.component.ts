import { Component, Input } from '@angular/core';
import { BaseBtnComponent } from 'src/bases/base-btn';

@Component({
  selector: 'raised-btn',
  templateUrl: './raised-btn.component.html',
  styles: [
    `:host { display: inline-block; margin: 0 10px}`,
  ],
})
export class RaisedBtnComponent extends BaseBtnComponent {
  @Input() public text: string;
}
