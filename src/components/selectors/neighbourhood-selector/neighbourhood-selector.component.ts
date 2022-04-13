import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NeighborhoodsCrud } from 'src/services/crud/neighborhoods/neighborhoods.crud';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StreetTypeSelector } from '../street-selector/street-selector.component';

@Component({
    selector: 'neighbourhood-selector',
    styles: [
        `:host{ display: block;width: 100%; }`,
    ],
    templateUrl: './neighbourhood-selector.html',
    providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => NeighbourhoodSelector),
          multi: true
      }
  ]
})
export class NeighbourhoodSelector extends BaseSelectorComponent implements ControlValueAccessor {
    public barrios: any[];
    public error: string;

    @Input() public value: any = '';
    @Input() public disabled: boolean = false;
    @Output() public valueChange = new EventEmitter<string>();
    onChange!:(item: any) => void;
    writeValue(neighbourhood: string): void {
      this.selectItem(neighbourhood)
    }
    registerOnChange(fn: () => void): void {
        this.onChange= fn;
    }
    registerOnTouched(fn: () => void): void {
    }

    constructor(
        protected nCrud: NeighborhoodsCrud,
    ) {super() }

    public getSearchObservable(query: string): Observable<any> {
        return this.nCrud
        .list({
          sort: 'name',
          dir: 'asc',
          limit: 20,
        })
        .pipe(
          map((resp) => {
            return resp.data.elements;
          }),
        );
      }
        
      }

        

