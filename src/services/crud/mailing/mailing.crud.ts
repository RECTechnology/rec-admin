
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from 'src/services/company/company.service';

@Injectable()
export class MailingCrud extends CrudBaseService<any> {
    public static STATUS_CREATED = 'created';
    public static STATUS_SCHEDULED = 'scheduled';
    public static STATUS_PROCESSED = 'processed';

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
