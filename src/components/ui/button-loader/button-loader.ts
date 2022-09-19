import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ControlesService } from '../../../services/controles/controles.service';

@Component({
  selector: 'btn-loader',
  templateUrl: './button-loader.html',
  styles: [
    `
      :host {
        width: '100%';
      }
    `,
  ],
})
export class ButtonLoader {
  @Output() public clicked: EventEmitter<any> = new EventEmitter<any>();
  @Input() public loading = false;
  @Input() public disabled = false;
  @Input() public submit = false;
  @Input() public text = '';
  @Input() public color = 'primary';

  constructor(private controles: ControlesService) {}

  public onClick() {
    this.clicked.emit();
  }
}
