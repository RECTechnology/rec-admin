import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseSelectorComponent } from 'src/bases/base-selector';

@Component({
    selector: 'street-type-selector',
    styles: [
        `:host{ display: block;width: 100%; }`,
    ],
    templateUrl: './street-selector.html',
})
export class StreetTypeSelector extends BaseSelectorComponent {
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
    public initialStreet: string = 'calle';
    
    constructor(){
        super()
    }

    public getSearchObservable(query: string): Observable<any> {
        return of([]);
        
      }
   
}
