import { Component, forwardRef, Input, SimpleChanges } from '@angular/core';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { Document } from '../../../shared/entities/document.ent';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StreetTypeSelector } from '../street-selector/street-selector.component';

@Component({
  selector: 'document-status-selector',
  templateUrl: './document-status-selector.html',
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => StreetTypeSelector),
        multi: true
    }
]
})
export class DocumentStatusSelector extends BaseSelectorComponent implements ControlValueAccessor {

  public documentStatuses= Document.ALL_STATUSES;

  onChange!:(item: any) => void;
  writeValue(item: any): void {
      if(item){
          this.selectItem(item);
      }
  }
  registerOnChange(fn: () => void): void {
      this.onChange= fn;
  }
  registerOnTouched(fn: () => void): void {
  }
  

  constructor(public dkCrud: DocumentKindsCrud,) {
    super();
  }

  public getSearchObservable(query: string): Observable<any> {
    return of([]);
  }
}