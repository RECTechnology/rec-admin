
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Neighborhood } from 'src/shared/entities/translatable/neighborhood.ent';

@Injectable()
export class NeighborhoodsCrud extends CrudBaseService {
    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
        this.basePath = '/neighbourhoods';
        this.setFlag('translateHeaders');
        this.mapItems = true;
    }

    public mapper(item) {
        return new Neighborhood(item);
    }
}
