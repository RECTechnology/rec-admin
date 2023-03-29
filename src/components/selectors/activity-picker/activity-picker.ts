import { ActivitiesCrud } from './../../../services/crud/activities/activities.crud';
import { Component, forwardRef, Input, SimpleChanges } from '@angular/core';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { Activity } from 'src/shared/entities/translatable/activity.ent';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'activity-picker',
  templateUrl: './activity-picker.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ActivityPicker),
      multi: true,
    },
  ],
})
export class ActivityPicker extends BaseSelectorComponent implements ControlValueAccessor {
  @Input() public parent: Activity;

  onChange!: (item: any) => void;
  writeValue(item: any): void {
    if (item) {
      this.selectItem(item);
    }
  }
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {}

  constructor(private activitiesService: ActivitiesCrud) {
    super();
  }
  ngOnInit() {}

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
        limit: 300,
        parent_id: this.parent,
      })
      .pipe(
        map((resp) => {
          if (this.sendedItems) {
            return this.items;
          } else {
            return resp.data.elements;
          }
        }),
      );
  }
}
