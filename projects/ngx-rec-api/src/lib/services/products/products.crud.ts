
import { Injectable } from '@angular/core';
import { CrudBaseService } from '../../base/crud.base';
import { HttpClient } from '@angular/common/http';
import { NgxRecOptions } from '../../options';
import { Product } from '../../entities/translatable/product.ent';

@Injectable()
export class ProductsCrudService extends CrudBaseService {
    constructor(
        http: HttpClient,
        options: NgxRecOptions,
    ) {
        super(http, options);
        this.basePath = '/product_kinds';
        this.setFlag('translateHeaders');
        this.mapItems = true;
    }

    public mapper(item) {
        return new Product(item);
    }

    public addConsumedByToProduct(product_id, activity_id) {
        const url = [...this.getUrlBase(), '/', product_id, '/', 'default_consuming_by'];
        return this.post(url, { id: activity_id }).pipe(this.itemMapper());
    }

    public removeConsumedByToProduct(product_id, activity_id) {
        const url = [...this.getUrlBase(), '/', product_id, '/', 'default_consuming_by', '/', activity_id];
        return this.delete(url, null).pipe(this.itemMapper());
    }

    public addProducingByToProduct(product_id, activity_id) {
        const url = [...this.getUrlBase(), '/', product_id, '/', 'default_producing_by'];
        return this.post(url, { id: activity_id }).pipe(this.itemMapper());
    }

    public removeProducingByToProduct(product_id, activity_id) {
        const url = [...this.getUrlBase(), '/', product_id, '/', 'default_producing_by', '/', activity_id];
        return this.delete(url, null).pipe(this.itemMapper());
    }
}
