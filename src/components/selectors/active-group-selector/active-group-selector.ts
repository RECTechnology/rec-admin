import { Component, Input, SimpleChanges } from '@angular/core';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable, of } from 'rxjs';


@Component({
    selector: 'active-group-selector',
    templateUrl: './active-group-selector.html',
  })
  export class ActiveGroupSelector extends BaseSelectorComponent  {

    @Input()user_id;


    constructor( private usersCrud: UsersCrud){
      super()
    }


    public getSearchObservable(query: string): Observable<any> {
      return of([]);
      
    }
    selectItem(item) {
      this.updateAccount( item.id );
    }

    
  public updateAccount( data ) {
    this.usersCrud.update(this.user_id, {"active_group_id": data})
    .subscribe( resp => {
      //this.itemChanged.emit( data );
    })
  }
}