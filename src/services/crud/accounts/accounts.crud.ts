
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CompanyService } from 'src/services/company/company.service';
import { RecLang, REC_LANGS } from 'src/types';

@Injectable()
export class AccountsCrud extends CrudBaseService {

    public pdfHtml: string = '';

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

    public getPdf(account_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'report_clients_providers'];
        return this.get(url, {}, { Accept: 'application/pdf' }, { responseType: 'blob' });
    }

    public getPdfAsHtml(account_id, lang: RecLang = REC_LANGS.ES) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'report_clients_providers'];
        return this.get(url, {}, {
            Accept: 'text/html',
            'Content-Language': lang,
            'Accept-Language': lang,
        }, { responseType: 'text' });
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

    public addActivity(account_id, activity_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'activities'];
        return this.post(url, { id: activity_id }).pipe(this.itemMapper());
    }

    public deleteActivity(account_id, activity_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'activities', '/', activity_id];
        return this.delete(url).pipe(this.itemMapper());
    }

    public mapper(item: any) {
        return this.cs.mapCompany(item);
    }
}
