import { ActivitiesCrud } from './../../../services/crud/activities/activities.crud';
import { Component } from '@angular/core';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'activity-picker',
  templateUrl: './activity-picker.html',
})
export class ActivityPicker extends BaseSelectorComponent {
  constructor(private activitiesService: ActivitiesCrud) {
    super();
  }

  public getSearchObservable(query: string): Observable<any> {
    return this.activitiesService.list({ search: query, limit: 30 }).pipe(
      map((resp) => {
        return resp.data.elements;
      }),
    );
  }
}
