import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Challenge } from '../../../shared/entities/challenge.ent';

@Injectable()
export class ChallengeCrud extends CrudBaseService<Challenge> {
    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
        this.basePath = '/challenges';
        this.exportPath = '/account_challenges';
    }

    public mapper(item) {
        return item;
    }
}