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
export class CrudBaseService extends BaseService2 {

    public static PATH_LIST = '';
    public static PATH_SEARCH = '/search';
    public static PATH_EXPORT = '/export';

    public static ROLE_USER: CrudRole = 'user';
    public static ROLE_SELF: CrudRole = 'self';
    public static ROLE_MANAGER: CrudRole = 'manager';
    public static ROLE_ADMIN: CrudRole = 'admin';
    public static ROLE_SADMIN: CrudRole = 'super_admin';

    public basePath: string = '';
    public userRole: string = CrudBaseService.ROLE_ADMIN;
    public version: string = 'v3';

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

    // Crud methods
    public create(data: any, lang: RecLang = REC_LANGS.EN): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST];
        return this.post(url, data, 'application/json',
            lang ? { 'Content-Language': lang, 'Accept-Language': lang } : null,
        ).pipe(this.itemMapper());
    }

    public remove(id: string): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST, '/', id];
        return this.delete(url);
    }

    public update(id: string, data: any, lang: RecLang = REC_LANGS.EN): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST, '/', id];
        return this.put(url, data, 'application/json',
            lang ? { 'Content-Language': lang, 'Accept-Language': lang } : null,
        );
    }

    public list(query?: CrudQueryOptions, lang: RecLang = REC_LANGS.ALL): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST];
        return this.get(url, query, lang ? { 'Content-Language': lang, 'Accept-Language': lang } : null)
            .pipe(this.itemMapper());
    }

    public search(data: ListAccountsParams = {}, lang: RecLang = REC_LANGS.ALL): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_SEARCH];
        return this.get(url, data, lang ? { 'Content-Language': lang, 'Accept-Language': lang } : null)
            .pipe(this.itemMapper());
    }

    public find(id: any, lang: RecLang = REC_LANGS.EN): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST, '/', id];
        return this.get(url, null, lang ? { 'Content-Language': lang, 'Accept-Language': lang } : null)
            .pipe(this.itemMapper());
    }

    public export(exportOptions: any) {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_EXPORT];
        return this.get(url, exportOptions, { Accept: '*/*' }, { responseType: 'text' })
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
                if (resp && resp.data && resp.data.elements && resp.data.elements.length >= 1) {
                    resp.data.elements = resp.data.elements.map((el) => this.mapper(el));
                } else if (resp.data) {
                    resp.data = this.mapper(resp.data);
                }
                return resp;
            });
        }
    }
}
