import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseBtnComponent } from 'src/bases/base-btn';

@Component({
  selector: 'icon-btn',
  templateUrl: './icon-btn.component.html',
  styles: [
    `:host { display: inline-block; margin: 0 10px}`,
  ],
})
export class IconBtnComponent extends BaseBtnComponent { }
