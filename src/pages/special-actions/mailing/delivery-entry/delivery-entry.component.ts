import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'delivery-entry',
    templateUrl: './delivery-entry.html',
    styles: [
        `:host{ width: 100%; }`,
    ],
})
export class DeliveryEntry {
    @Input() public item: any;
    @Input() public disabled: boolean;
    @Output() public remove: EventEmitter<any> = new EventEmitter();
}
