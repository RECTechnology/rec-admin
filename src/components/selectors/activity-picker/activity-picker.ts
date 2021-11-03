import { ActivitiesCrud } from './../../../services/crud/activities/activities.crud';
import { Component, Input, SimpleChanges } from '@angular/core';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { Activity } from 'src/shared/entities/translatable/activity.ent';

@Component({
  selector: 'activity-picker',
  templateUrl: './activity-picker.html',
})
export class ActivityPicker extends BaseSelectorComponent {
  @Input() public parent: Activity;

  constructor(private activitiesService: ActivitiesCrud) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('parent' in changes) {
      this.parent = changes['parent'].currentValue;
      this.search();
    }
  }

  public getSearchObservable(query: string): Observable<any> {
    return this.activitiesService
      .list({
        search: query,
        limit: 10,
        parent: this.parent,
      })
      .pipe(
        map((resp) => {
          return resp.data.elements;
        }),
      );
  }
}
