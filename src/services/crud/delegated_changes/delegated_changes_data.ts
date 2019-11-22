
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DelegatedChangesDataCrud extends CrudBaseService<any> {
    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
        this.basePath = '/delegated_change_data';
    }

    public importFromCSV(data: any) {
        const url = [...this.getUrlBase(), '/', 'csv'];
        return this.post(url, data);
    }
}
