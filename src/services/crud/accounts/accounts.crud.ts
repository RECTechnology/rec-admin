
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CompanyService } from 'src/services/company/company.service';

@Injectable()
export class AccountsCrud extends CrudBaseService {
    constructor(
        http: HttpClient,
        public us: UserService,
        public cs: CompanyService,
    ) {
        super(http, us);
        this.basePath = '/accounts';
        this.userRole = 'admin';
        this.mapItems = true;
    }

    public mapper(item: any) {
        return this.cs.mapCompany(item);
    }
}
