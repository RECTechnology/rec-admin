import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Qualification } from '../../../shared/entities/qualification.ent';

@Injectable()
export class QualificationsCrud extends CrudBaseService<Qualification> {
    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
        this.basePath = '/qualifications';
    }

    public mapper(item) {
        return item;
    }
}