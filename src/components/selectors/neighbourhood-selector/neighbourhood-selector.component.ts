import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NeighborhoodsCrud } from 'src/services/crud/neighborhoods/neighborhoods.crud';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Component({
    selector: 'neighbourhood-selector',
    styles: [
        `:host{ display: block;width: 100%; }`,
    ],
    templateUrl: './neighbourhood-selector.html',
})
export class NeighbourhoodSelector extends BaseSelectorComponent {
    public barrios: any[];
    public error: string;

    @Input() public value: any = '';
    @Input() public disabled: boolean = false;
    @Output() public valueChange = new EventEmitter<string>();

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

        

