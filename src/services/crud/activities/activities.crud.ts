
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Activity } from 'src/shared/entities/translatable/activity.ent';

@Injectable()
export class ActivitiesCrud extends CrudBaseService {
    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
        this.basePath = '/activities';
        this.setFlag('translateHeaders');
        this.mapItems = true;
    }

    public mapper(item) {
        return new Activity(item);
    }
}
