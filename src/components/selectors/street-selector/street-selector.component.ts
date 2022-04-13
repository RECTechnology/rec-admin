import { Component, EventEmitter, forwardRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'street-type-selector',
    styles: [
        `:host{ display: block;width: 100%; }`,
    ],
    templateUrl: './street-selector.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => StreetTypeSelector),
            multi: true
        }
    ]
    
})
export class StreetTypeSelector extends BaseSelectorComponent implements ControlValueAccessor{
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
    onChange!:(item: any) => void;
    writeValue(street: string): void {
        if(street){
            this.selectItem(street);
        }
    }
    registerOnChange(fn: () => void): void {
        this.onChange= fn;
    }
    registerOnTouched(fn: () => void): void {
    }
    
    constructor(){
        super()
    }

    public getSearchObservable(query: string): Observable<any> {
        return of([]);
        
      }

   
}
