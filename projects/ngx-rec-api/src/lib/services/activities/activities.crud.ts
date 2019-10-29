
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudBaseService } from '../../base/crud.base';
import { NgxRecOptions } from '../../options';
import { Activity } from '../../entities/translatable/activity.ent';

@Injectable()
export class ActivitiesCrudService extends CrudBaseService {
    constructor(
        http: HttpClient,
        options: NgxRecOptions,
    ) {
        super(http, options);
        this.basePath = '/activities';
        this.setFlag('translateHeaders');
        this.mapItems = true;
    }

    public mapper(item) {
        return new Activity(item);
    }
}
