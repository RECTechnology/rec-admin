import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { BadgesCrud } from 'src/services/crud/badges/badges.crud';
import { Badge } from '../../../shared/entities/badge.ent';

@Component({
  selector: 'badges-selector',
  templateUrl: './badges-selector.html',
})
export class BadgesSelector extends BaseSelectorComponent {
  public error: string;

  @Input() public value: any = '';
  @Input() public disabled: boolean = false;
  @Output() public valueChange = new EventEmitter<string>();

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