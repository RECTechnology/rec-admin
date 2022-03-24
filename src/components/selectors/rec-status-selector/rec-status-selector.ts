import { Component, Input, SimpleChanges } from '@angular/core';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { Document } from '../../../shared/entities/document.ent';

@Component({
  selector: 'rec-status-selector',
  templateUrl: './rec-status-selector.html',
})
export class RecStatusSelector extends BaseSelectorComponent {

    public recStatuses= Document.REC_STATUS_TYPES;

  constructor(public dkCrud: DocumentKindsCrud,) {
    super();
  }

  public getSearchObservable(query: string): Observable<any> {
    return of([]);
  }
}