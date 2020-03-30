import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal-header',
  templateUrl: './modal-header.component.html',
})
export class ModalHeaderComponent {
  @Input() public title: string;
  @Input() public status: string = 'blue';
  @Output() public click: EventEmitter<any> = new EventEmitter();
}
