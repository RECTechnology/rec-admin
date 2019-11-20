import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal-header',
  templateUrl: './modal-header.component.html',
})
export class ModalHeaderComponent {
  @Input() public title: string;
  @Input() public status: string = 'info';
  @Output() public click: EventEmitter<any> = new EventEmitter();
}
