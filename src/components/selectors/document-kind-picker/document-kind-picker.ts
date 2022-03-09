import { ActivitiesCrud } from './../../../services/crud/activities/activities.crud';
import { Component, Input, SimpleChanges } from '@angular/core';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { Activity } from 'src/shared/entities/translatable/activity.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';

@Component({
  selector: 'document-kind-picker',
  templateUrl: './document-kind-picker.html',
})
export class DocumentKindPicker extends BaseSelectorComponent {

  constructor(public dkCrud: DocumentKindsCrud,) {
    super();
  }





  public getSearchObservable(query: string): Observable<any> {
    return this.dkCrud
      .list({
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
