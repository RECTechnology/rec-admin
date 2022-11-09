import { Injectable, Input } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Observable } from "rxjs";
import { ConfigurationSettingsCrud } from '../crud/config_settings/configuration_settings';

@Injectable()
export class HideShowB2b implements CanActivate {
  constructor(
    private crud: ConfigurationSettingsCrud
  ) { }

  public canActivate(): Observable<any> {
    return new Observable((observer) => {
        this.crud.search(
            {scope: 'admin_panel', name: 'menu_item_b2b'}
        )
        .subscribe( (resp) => {
            if(resp.data.elements[0].name === 'menu_item_b2b' && 
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

@Injectable()
export class HideShowReports implements CanActivate {
  constructor(
    private crud: ConfigurationSettingsCrud
  ) { }

  public canActivate(): Observable<any> {
    return new Observable((observer) => {
        this.crud.search(
            {scope: 'admin_panel', name: 'menu_item_reports'}
        )
        .subscribe( (resp) => {
            if(resp.data.elements[0].name === 'menu_item_reports' && 
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

@Injectable()
export class HideShowQualifications implements CanActivate {
  constructor(
    private crud: ConfigurationSettingsCrud
  ) { }

  public canActivate(): Observable<any> {
    return new Observable((observer) => {
        this.crud.search(
            {scope: 'admin_panel', name: 'menu_item_qualifications'}
        )
        .subscribe( (resp) => {
            if(resp.data.elements[0].name === 'menu_item_qualifications' && 
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

@Injectable()
export class HideShowMail implements CanActivate {
  constructor(
    private crud: ConfigurationSettingsCrud
  ) { }

  public canActivate(): Observable<any> {
    return new Observable((observer) => {
        this.crud.search(
            {scope: 'admin_panel', name: 'menu_item_email'}
        )
        .subscribe( (resp) => {
            if(resp.data.elements[0].name === 'menu_item_email' && 
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