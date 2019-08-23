
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CompanyService } from 'src/services/company/company.service';

@Injectable()
export class AccountsCrud extends CrudBaseService {
    constructor(
        http: HttpClient,
        public us: UserService,
        public cs: CompanyService,
    ) {
        super(http, us);
        this.basePath = '/accounts';
        this.userRole = 'admin';
        this.mapItems = true;
    }

    public addConsumedProductToAccount(account_id, product_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'consuming_products'];
        return this.post(url, { id: product_id }).pipe(this.itemMapper());
    }

    public addProducedProductToAccount(account_id, product_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'producing_products'];
        return this.post(url, { id: product_id }).pipe(this.itemMapper());
    }

    public removeConsumedProductToAccount(account_id, product_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'consuming_products', '/', product_id];
        return this.delete(url).pipe(this.itemMapper());
    }

    public removeProducedProductToAccount(account_id, product_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'producing_products', '/', product_id];
        return this.delete(url).pipe(this.itemMapper());
    }

    public mapper(item: any) {
        return this.cs.mapCompany(item);
    }
}
