import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'log-status-selector',
    styles: [
        `:host{ display: block; width: 100%; }`,
    ],
    templateUrl: './log-status-selector.html',
})
export class LogStatusSelector implements OnInit {
    public streetTypes: any[] = [
        'DEBUG',
        'WARNING',
        'ERROR'
    ];

    public error: string;

    @Input() public value: any = 'DEBUG';
    @Input() public disabled: boolean = false;
    @Output() public valueChange = new EventEmitter<string>();

    public ngOnInit() {
        this.value = this.value || 'DEBUG';
    }
}
