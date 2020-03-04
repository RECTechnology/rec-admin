
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/shared/entities/translatable/product.ent';

@Injectable()
export class IbansCrud extends CrudBaseService<Product> {
    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
        this.basePath = '/ibans';
    }

    public mapper(item) {
        return item;
    }
}
