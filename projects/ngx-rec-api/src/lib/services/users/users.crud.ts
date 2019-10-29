
import { Injectable } from '@angular/core';
import { CrudBaseService } from '../../base/crud.base';
import { HttpClient } from '@angular/common/http';
import { NgxRecOptions } from '../../options';
import { User } from '../../entities/user.ent';

@Injectable()
export class UsersCrudService extends CrudBaseService {
    constructor(
        http: HttpClient,
        options: NgxRecOptions,
    ) {
        super(http, options);
        this.basePath = '/users';
        this.userRole = 'admin';
        this.mapItems = true;
    }

    public mapper(item) {
        return new User(item);
    }
}
