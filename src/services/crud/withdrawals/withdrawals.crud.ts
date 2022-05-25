import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from 'src/services/company/company.service';


@Injectable()
export class WithdrawalCrud extends CrudBaseService<any> {

    constructor(
        http: HttpClient,
        public us: UserService,
        public cs: CompanyService,
    ) {
        super(http, us);
        this.basePath = '/treasure_withdrawals';
        this.userRole = 'admin';
        this.mapItems = true;
    }
}