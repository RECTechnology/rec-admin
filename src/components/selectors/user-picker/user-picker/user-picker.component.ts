import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { BaseSelectorComponent } from '../../../../bases/base-selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { User } from '../../../../shared/entities/user.ent';

@Component({
  selector: 'user-picker',
  templateUrl: './user-picker.component.html',
  styleUrls: ['./user-picker.component.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => UserPickerComponent),
        multi: true
  }]
})
export class UserPickerComponent extends BaseSelectorComponent {

  constructor( private usersCrud: UsersCrud ){
    super()
  }
  onChange!:(item: any) => void;
  writeValue(user: User): void {
      if(user){
          this.selectItem(user);
      }
  }
  registerOnChange(fn: () => void): void {
      this.onChange= fn;
  }
  registerOnTouched(fn: () => void): void {
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
  