import { Component, EventEmitter, forwardRef, Input, SimpleChanges } from '@angular/core';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StreetTypeSelector } from '../street-selector/street-selector.component';
import { Account } from '../../../shared/entities/account.ent';

@Component({
  selector: 'account-picker', 
  templateUrl: './account-picker.component.html',
  styleUrls: ['./account-picker.component.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AccountPickerComponent),
        multi: true
    }
]
})
export class AccountPickerComponent extends BaseSelectorComponent {

  @Input() filters: any = null;
  onChange!:(item: any) => void;
  onTouch!: () => void;
    writeValue(account: Account): void {
        if(account){
            this.selectItem(account);
        }
    }
    registerOnChange(fn: () => void): void {
        this.onChange= fn;
    }
    registerOnTouched(fn: () => void): void {
      this.onTouch = fn;
    }

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