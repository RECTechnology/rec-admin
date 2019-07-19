import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'street-type-selector',
    styles: [
        `:host{ display: block;width: 100%; }`,
    ],
    templateUrl: './street-selector.html',
})
export class StreetTypeSelector implements OnInit {
    public streetTypes: any[] = [
        'alameda',
        'avenida',
        'bulevar',
        'calle',
        'camino',
        'carretera',
        'glorieta',
        'jardin',
        'parque',
        'paseo',
        'plaza',
        'poligono',
        'rambla',
        'ronda',
        'rua',
        'travesia',
        'urbanizacion',
        'via',
    ];
    public error: string;
    @Input() public value: any = 'calle';
    @Output() public valueChange = new EventEmitter<string>();

    public ngOnInit() {
        this.value = this.value || 'calle';
    }
}
