import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { BaseSelectorComponent } from '../../../../bases/base-selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'user-picker',
  templateUrl: './user-picker.component.html',
  styleUrls: ['./user-picker.component.scss'],
})
export class UserPickerComponent extends BaseSelectorComponent {

  constructor( private usersCrud: UsersCrud ){
    super()
  }

  public getSearchObservable(query: string): Observable<any> {
    return this.usersCrud
      .search({
        search: query,
        sort: 'name',
        dir: 'asc',
        limit: 20
      })
      .pipe(
        map((resp) => {
          return resp.data.elements;
        }),
      );
  }
}
  