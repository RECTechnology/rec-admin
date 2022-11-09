import { HttpClient } from "@angular/common/http";
import { BaseService } from "../base/base.service";
import { UserService } from "../user.service";
import { ConfigurationSettingsCrud } from '../crud/config_settings/configuration_settings';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Observer } from 'rxjs/internal/types';

@Injectable()
export class ConfigSettings extends BaseService {
    public configuration_items: any = [];

    constructor(
        http: HttpClient,
        us: UserService,
        public crud: ConfigurationSettingsCrud
    ){
        super(http, us);
    }

    public searchSettings(): Observable<any> {
        return new Observable((observer) => {
            this.crud.search(
                {scope: 'admin_panel'}
              )
              .subscribe( (resp) => {
                this.configuration_items = resp.data.elements;
                observer.next(this.configuration_items);
                observer.complete();
              },
              (error => {
                console.log(error.message)
                observer.next(false);
                observer.complete();

              })
              )   
            } 
        )}
      }