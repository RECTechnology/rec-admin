
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from 'src/services/company/company.service';
import { User } from 'src/shared/entities/user.ent';

@Injectable()
export class UsersCrud extends CrudBaseService<User> {
    constructor(
        http: HttpClient,
        public us: UserService,
        public cs: CompanyService,
    ) {
        super(http, us);
        this.basePath = '/users';
        this.userRole = 'admin';
        this.mapItems = true;
    }

    public mapper(item) {
        return new User(item);
    }
}
