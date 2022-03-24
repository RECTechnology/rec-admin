import { Component, Input, SimpleChanges } from '@angular/core';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'account-picker', 
  templateUrl: './account-picker.component.html',
  styleUrls: ['./account-picker.component.scss'],
})
export class AccountPickerComponent extends BaseSelectorComponent {

  @Input() filters: any = null;

  constructor( private accountsCrud: AccountsCrud){
    super()
  }

  public getSearchObservable(query: string): Observable<any> {
    return this.accountsCrud
      .list({
        search: query,
        sort: 'name',
        dir: 'asc',
        limit: 20,
        ...this.filters
      })
      .pipe(
        map((resp) => {
          return resp.data.elements;
        }),
      );
  }

}