import { Injectable } from '@angular/core';
import { BaseService2 } from './base.service-v2';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { ListAccountsParams } from 'src/interfaces/search';
import { RecLang, REC_LANGS, CrudRole } from 'src/types';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

export interface CrudQueryOptions {
    search?: string;
    offset?: number;
    limit?: number;
    [key: string]: any;
}

@Injectable()
export class CrudBaseService<T> extends BaseService2 {

    public static PATH_LIST = '';
    public static PATH_SEARCH = '/search';
    public static PATH_EXPORT = '/export';
    public static PATH_IMPORT = '/import';

    public static ROLE_USER: CrudRole = 'user';
    public static ROLE_SELF: CrudRole = 'self';
    public static ROLE_MANAGER: CrudRole = 'manager';
    public static ROLE_ADMIN: CrudRole = 'admin';
    public static ROLE_SADMIN: CrudRole = 'super_admin';

    public basePath: string = '';
    public userRole: string = CrudBaseService.ROLE_ADMIN;
    public version: string = 'v3';
    public cached: any = [];
    public tName = null;

    public DEBUG: boolean = false;

    public mapItems: boolean = false;

    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
    }

    // Noop mapper, it will be used when this.mapItems === false
    public noopMapper(item: any) {
        return item;
    }

    public mapper(item: any) {
        return item;
    }

    public log(...log: any[]) {
        if (this.DEBUG) {
            const thisName = this.constructor.name;
            console.log(`[${thisName}] -`, ...log);
        }
    }

    // Crud methods
    public create(data: T, lang: RecLang = REC_LANGS.EN): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST];
        this.log(`create ${this.tName}`, arguments);
        return this.post(url, data, 'application/json',
            lang ? { 'Content-Language': lang, 'Accept-Language': lang } : null,
        ).pipe(this.itemMapper());
    }

    public remove(id: any): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST, '/', id];
        this.log(`remove ${this.tName}`, id);
        return this.delete(url);
    }

    public update(id: any, data: any, lang: RecLang = REC_LANGS.EN): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST, '/', id];
        this.log(`update ${this.tName}`, id, data);
        console.log("Printing urlllllllllllllllllllllllllllll");
        console.log(url);
        console.log(data);
        return this.put(url, data, 'application/json',
            lang ? { 'Content-Language': lang, 'Accept-Language': lang } : null,
        );
    }

    public list(query?: CrudQueryOptions, lang: RecLang = REC_LANGS.ALL): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST];
        this.log(`list ${this.tName}`, query);
        return this.get(url, query, lang ? { 'Content-Language': lang, 'Accept-Language': lang } : null)
            .pipe(this.itemMapper());
    }

    public search(data: ListAccountsParams = {}, lang: RecLang = REC_LANGS.ALL): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_SEARCH];
        this.log(`search ${this.tName}`, data);
        return this.get(url, data, lang ? { 'Content-Language': lang, 'Accept-Language': lang } : null)
            .pipe(this.itemMapper());
    }

    public find(id: any, lang: RecLang = REC_LANGS.EN): Observable<{ data: T, [key: string]: any } | any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST, '/', id];
        this.log(`find ${this.tName}`, id);
        return this.get(url, null, lang ? { 'Content-Language': lang, 'Accept-Language': lang } : null)
            .pipe(this.itemMapper());
    }

    public export(exportOptions: any) {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_EXPORT];
        this.log(`export ${this.tName}`, exportOptions);
        return this.get(url, exportOptions, { Accept: '*/*' }, { responseType: 'text' })
            .pipe(this.itemMapper());
    }

    public import(importOptions: { csv: string }) {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_IMPORT];
        this.log(`import ${this.tName}`, importOptions);
        return this.post(url, importOptions)
            .pipe(this.itemMapper());
    }

    public listGetTotal(query?: CrudQueryOptions, lang: RecLang = REC_LANGS.ALL) {
        return this.list(query, lang).pipe(map((el) => el.data.total));
    }

    public getUrlBase() {
        return ['/', this.userRole, '/', this.version, this.basePath];
    }

    public itemMapper() {
        if (!this.mapItems) {
            return map((resp) => resp);
        } else {
            return map((resp: any) => {
                if (resp && resp.data && resp.data.elements) {
                    resp.data.elements = resp.data.elements.map((el) => this.mapper(el));
                } else if (resp.data) {
                    resp.data = this.mapper(resp.data);
                }
                return resp;
            });
        }
    }

    public cache(fn?) {
        return map((resp: any) => {
            this.cached = (fn && typeof fn === 'function') ? fn(resp) : resp.data.elements || resp.data;
            return resp;
        });
    }
}
