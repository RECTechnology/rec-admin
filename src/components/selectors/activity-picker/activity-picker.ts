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
  ngOnInit(){
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('item' in changes) {
      this.search();

    }
    if ('parent' in changes) {
      this.parent = changes['parent'].currentValue;
      this.search();

    }
  }

  public getSearchObservable(query: string): Observable<any> {
    return this.activitiesService
      .search({
        search: query,
        limit:300,
        parent_id: this.parent,
      })
      .pipe(
        map((resp) => {
          if(this.sendedItems){
            return this.items
          }else{
            return resp.data;
          }
        }),
      );
  }
}
