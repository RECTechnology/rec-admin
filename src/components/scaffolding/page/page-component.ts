import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-page',
    templateUrl: './page.html',
})
export class AppPage {
    @Input('padding') public padding = true;
    @Input('class') public className = '';

    constructor(
        public title: Title,
    ) { }
}
