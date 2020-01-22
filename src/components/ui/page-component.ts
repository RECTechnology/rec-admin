import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-page',
    template: `
    <div collapsesWhen='sidemenu' class="page {{className}}"
        [ngClass]="{'padd-x20': padding}"
    >
        <ng-content></ng-content>
    </div>
    `,
})
export class AppPage {
    @Input('padding') public padding = true;

    constructor(
        public title: Title,
    ) { }
}
