import { Component, forwardRef } from '@angular/core';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable, of } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RewardsCrud } from '../../../services/crud/reward/reward.crud';
import { map } from 'rxjs/internal/operators/map';
import { Challenge } from 'src/shared/entities/challenge.ent';

@Component({
  selector: 'reward-selector',
  templateUrl: './reward-selector.html',
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RewardSelector),
        multi: true
    }
]
})
export class RewardSelector extends BaseSelectorComponent  implements ControlValueAccessor {

  onChange!:(item: any) => void;
  onTouch!: () => void;
    writeValue(challenge: Challenge): void {
        if(challenge){
            this.selectItem(challenge);
        }
    }
    registerOnChange(fn: () => void): void {
        this.onChange= fn;
    }
    registerOnTouched(fn: () => void): void {
      this.onTouch = fn;
    }
  

  constructor(public crud: RewardsCrud,) {
    super();
  }

  //Para filtrar los rewards que no tengan un challenge asignado
  public filterRewards(rewards){
    const rewardsFiltered = rewards.filter( reward => !reward.hasOwnProperty('challenge'));
    return rewardsFiltered;
  }

  public getSearchObservable(query: string): Observable<any> {
    return this.crud
      .list({
        search: query,
        sort: 'name',
        dir: 'asc',
        limit: 20,
      })
      .pipe(
        map((resp) => {
          return this.filterRewards(resp.data.elements);
        }),
      );
  }
}