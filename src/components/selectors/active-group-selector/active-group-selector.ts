import { Component, Input, SimpleChanges } from '@angular/core';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable, of } from 'rxjs';
import { AlertsService } from '../../../services/alerts/alerts.service';


@Component({
    selector: 'active-group-selector',
    templateUrl: './active-group-selector.html',
  })
  export class ActiveGroupSelector extends BaseSelectorComponent  {

    @Input()user_id;


    constructor( private usersCrud: UsersCrud, private alerts: AlertsService){
      super()
    }


    public getSearchObservable(query: string): Observable<any> {
      return of([]);
      
    }
    selectItem(item) {
      this.updateAccount( item.id );
      this.alerts.showSnackbar("Active account changed to: " + item.name, "OK")
      
    }

    
  public updateAccount( data ) {
    this.usersCrud.update(this.user_id, {"active_group_id": data})
    .subscribe( resp => {
      //this.itemChanged.emit( data );
    })
  }
}