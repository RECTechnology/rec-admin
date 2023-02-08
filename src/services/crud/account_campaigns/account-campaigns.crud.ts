import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Badge } from '../../../shared/entities/badge.ent';

@Injectable()
export class AccountCampaignsCrud extends CrudBaseService<any> {
    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
        this.basePath = '/account_campaigns';
    }

    public mapper(item) {
        return item;
    }
}