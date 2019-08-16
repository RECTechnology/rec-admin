import { Injectable } from '@angular/core';
import { BaseService2 } from './base.service-v2';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { SearchAccountsParams, ListAccountsParams } from 'src/interfaces/search';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface CrudQueryOptions {
    search?: string;
    offset?: number;
    limit?: number;
    [key: string]: any;
}

export type CrudRole = 'user' | 'admin' | 'self' | 'super_admin' | 'manager';

@Injectable()
export class CrudBaseService extends BaseService2 {

    public static PATH_LIST = '';
    public static PATH_SEARCH = '/search';
    public static PATH_EXPORT = '/export';

    public static ROLE_USER: CrudRole = 'user';
    public static ROLE_SELF: CrudRole = 'self';
    public static ROLE_ADMIN: CrudRole = 'admin';
    public static ROLE_SADMIN: CrudRole = 'super_admin';

    public basePath: string = '';
    public userRole: string = CrudBaseService.ROLE_USER;
    public version: string = 'v3';

    public mapItems: boolean = false;

    constructor(
        http: HttpClient,
        public us: UserService,
        // basePath: string = '',
        // userRole: string = CrudBaseService.ROLE_USER,
        // version: string = 'v3',
    ) {
        super(http, us);
        // this.basePath = basePath;
        // this.userRole = userRole;
        // this.version = version;
    }

    // Noop mapper, it will be used when this.mapItems === false
    public noopMapper(item: any) {
        return item;
    }

    public mapper(item: any) {
        return item;
    }

    // Crud methods
    public create(data: any): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST];
        return this.post(url, data)
            .pipe(this.itemMapper());
    }

    public remove(id: string): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST, '/', id];
        return this.delete(url);
    }

    public update(id: string, data: any): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST, '/', id];
        return this.put(url, data);
    }

    public list(query?: CrudQueryOptions): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST];
        return this.get(url, query)
            .pipe(this.itemMapper());
    }

    public search(data: ListAccountsParams = {}): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_SEARCH];
        return this.get(url, data)
            .pipe(this.itemMapper());
    }

    public find(id: string): Observable<any> {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_LIST, '/', id];
        return this.get(url)
            .pipe(this.itemMapper());
    }

    public export(exportOptions: any) {
        const url = [...this.getUrlBase(), CrudBaseService.PATH_EXPORT];
        return this.get(url, exportOptions, { Accept: '*/*' }, { responseType: 'text' })
            .pipe(this.itemMapper());
    }


    private getUrlBase() {
        return ['/', this.userRole, '/', this.version, this.basePath];
    }

    private itemMapper() {
        if (!this.mapItems) {
            return map((resp) => resp);
        } else {
            return map((resp: any) => {
                console.log('mapper resp', resp);
                if (resp && resp.data && resp.data.elements && resp.data.elements.length > 1) {
                    resp.data.elements = resp.data.elements.map((el) => this.mapper(el));
                } else if (resp.data) {
                    console.log('data', resp.data);
                    resp.data = this.mapper(resp.data);
                }
                return resp;
            });
        }
    }
}
