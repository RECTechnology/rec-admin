
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudBaseService } from '../../base/crud.base';
import { NgxRecOptions } from '../../options';
import { Account } from '../../entities/account.ent';
import { RecLang, REC_LANGS } from '../../types';

@Injectable()
export class AccountsCrudService extends CrudBaseService {

    public pdfHtml: string = '';

    constructor(
        http: HttpClient,
        options: NgxRecOptions,
    ) {
        super(http, options);
        this.basePath = '/accounts';
        this.userRole = 'admin';
        this.mapItems = true;
    }

    public mapper(item) {
        return new Account(item);
    }

    public getPdf(account_id, lang: RecLang = REC_LANGS.ES) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'report_clients_providers'];
        return this.get(url, {}, {
            'Accept': 'application/pdf',
            'Content-Language': lang,
            'Accept-Language': lang,
        }, { responseType: 'blob' });
    }

    public getPdfAsHtml(account_id, lang: RecLang = REC_LANGS.ES) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'report_clients_providers'];
        return this.get(url, {}, {
            'Accept': 'text/html',
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

    // public mapper(item: any) {
    //     return this.cs.mapCompany(item);
    // }
}
