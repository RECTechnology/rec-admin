import { Component, Input, SimpleChanges } from '@angular/core';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { Document } from '../../../shared/entities/document.ent';

@Component({
  selector: 'document-status-selector',
  templateUrl: './document-status-selector.html',
})
export class DocumentStatusSelector extends BaseSelectorComponent {

    public documentStatuses= Document.ALL_STATUSES;

  constructor(public dkCrud: DocumentKindsCrud,) {
    super();
  }

  public getSearchObservable(query: string): Observable<any> {
    return of([]);
  }
}