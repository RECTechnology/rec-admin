
import { Injectable } from '@angular/core';
import { CrudBaseService } from '../../base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CompanyService } from 'src/services/company/company.service';
import { NgxRecOptions } from '../../options';

@Injectable()
export class MailingDeliveriesCrudService extends CrudBaseService {

    public static STATUS_CREATED = 'created';
    public static STATUS_SCHEDULED = 'scheduled';
    public static STATUS_SENT = 'sent';
    public static STATUS_CANCELLED = 'cancelled';
    public static STATUS_ERRORED = 'errored';

    constructor(
        public cs: CompanyService,
        http: HttpClient,
        options: NgxRecOptions,
    ) {
        super(http, options);
        this.basePath = '/mailing_deliveries';
        this.userRole = 'admin';
        this.mapItems = true;
    }
}
