import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate } from "@angular/router";
import { Observable } from "rxjs";
import { ConfigurationSettingsCrud } from '../crud/config_settings/configuration_settings';

@Injectable()
export class HideShowMenuItem implements CanActivate {
  constructor(
    private crud: ConfigurationSettingsCrud
  ) { }

  public canActivate(next: ActivatedRouteSnapshot): Observable<any> {
    return new Observable((observer) => {
        this.crud.search(
            {scope: 'admin_panel', name: next.data.item}
        )
        .subscribe( (resp) => {
            if(
                resp.data.elements[0].value === 'enabled'){
                observer.next(true);
                observer.complete();
            }else {
                observer.next(false);
                observer.complete();
            }
        },
        (error => {
            if(error){
                observer.next(false);
                observer.complete();
            }
        })
        )
        
    })
  }
}