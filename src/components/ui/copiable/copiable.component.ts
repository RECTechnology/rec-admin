import { Component, Input } from '@angular/core';

@Component({
    selector: 'copiable-badge',
    templateUrl: './copiable.html',
    styles: [
        `:host { display: inline-block; margin: 0 10px}`,
    ],
})
export class CopiableComponent {
    @Input() public label: string;
    @Input() public value: any;
}
