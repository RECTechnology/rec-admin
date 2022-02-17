
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DelegatedChangesCrud extends CrudBaseService<any> {
    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
        this.basePath = '/delegated_changes';
    }

    public sendMassiveTransactionsReport(id: string) {
        const url = `/admin/v4/reports/massive-transactions/${id}`;

        return this.post(url, {});
    }

    public startTransactions(id,data: any) {
        const url = `admin/v3/delegated_changes/${id}`;

        return this.put(url, data).subscribe;
    }
}
