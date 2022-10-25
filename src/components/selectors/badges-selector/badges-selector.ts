import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { BadgesCrud } from 'src/services/crud/badges/badges.crud';
import { Badge } from '../../../shared/entities/badge.ent';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'badges-selector',
  templateUrl: './badges-selector.html',
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => BadgesSelector),
        multi: true
    }
]
})
export class BadgesSelector extends BaseSelectorComponent implements ControlValueAccessor {
  
  public error: string;
  @Input() public disabled: boolean = false;

  onChange!:(item: any) => void;
  onTouch!: () => void;
    writeValue(badge: Badge): void {
        if(badge){
            this.selectItem(badge);
        }
    }
    registerOnChange(fn: () => void): void {
        this.onChange= fn;
    }
    registerOnTouched(fn: () => void): void {
      this.onTouch = fn;
    }

  constructor(protected badgesService: BadgesCrud) {
    super()
  }

  public getSearchObservable(query: string): Observable<Badge> {
    return this.badgesService
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