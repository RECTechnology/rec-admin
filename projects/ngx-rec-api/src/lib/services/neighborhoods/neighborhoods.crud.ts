
import { Injectable } from '@angular/core';
import { CrudBaseService } from '../../base/crud.base';
import { HttpClient } from '@angular/common/http';
import { NgxRecOptions } from '../../options';
import { Neighborhood } from '../../entities/translatable/neighborhood.ent';

@Injectable()
export class NeighborhoodsCrudService extends CrudBaseService {
    constructor(
        http: HttpClient,
        options: NgxRecOptions,
    ) {
        super(http, options);
        this.basePath = '/neighbourhoods';
        this.setFlag('translateHeaders');
        this.mapItems = true;
    }

    public mapper(item) {
        return new Neighborhood(item);
    }
}
