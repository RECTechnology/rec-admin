
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from 'src/services/company/company.service';

@Injectable()
export class MailingDeliveriesCrud extends CrudBaseService<any> {

    public static STATUS_CREATED = 'created';
    public static STATUS_SCHEDULED = 'scheduled';
    public static STATUS_SENT = 'sent';
    public static STATUS_CANCELLED = 'cancelled';
    public static STATUS_ERRORED = 'errored';

    constructor(
        http: HttpClient,
        public us: UserService,
        public cs: CompanyService,
    ) {
        super(http, us);
        this.basePath = '/mailing_deliveries';
        this.userRole = 'admin';
        this.mapItems = true;
    }
}
