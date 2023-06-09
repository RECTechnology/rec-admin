import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigurationSettingsCrud extends CrudBaseService<any> {

    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
        this.basePath = '/configuration_settings';
        this.userRole = 'admin';
        this.mapItems = true;
    }
}