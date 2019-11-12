
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CompanyService } from 'src/services/company/company.service';
import { RecLang } from 'src/types';

@Injectable()
export class MailingCrud extends CrudBaseService {

    // public static STATUS_SCHEDULED = 'scheduled';
    // public static STATUS_SENT = 'sent';
    // public static STATUS_ERRORED = 'errored';

    public static STATUS_CREATED = 'created';
    public static STATUS_SCHEDULED = 'scheduled';
    public static STATUS_PROCESSED = 'processed';
    public static STATUS_CANCELED = 'cancelled';

    constructor(
        http: HttpClient,
        public us: UserService,
        public cs: CompanyService,
    ) {
        super(http, us);
        this.basePath = '/mailings';
        this.userRole = 'admin';
        this.mapItems = true;
    }

    public addAttachment(mailing_id, attachments, lang: any) {
        return this.update(mailing_id, { attachments }, lang);
    }
}
