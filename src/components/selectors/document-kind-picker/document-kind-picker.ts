import { Component, forwardRef } from '@angular/core';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'document-kind-picker',
  templateUrl: './document-kind-picker.html',
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DocumentKindPicker),
        multi: true
    }
]
})
export class DocumentKindPicker extends BaseSelectorComponent implements ControlValueAccessor {

  constructor(public dkCrud: DocumentKindsCrud,) {
    super();
  }

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

  public getSearchObservable(query: string): Observable<any> {
    return this.dkCrud
      .search({
        search: query,
        sort: 'name',
        dir: 'asc',
        limit: 100
      })
      .pipe(
        map((resp) => {
          return resp.data.elements;
        }),
      );
  }
}
