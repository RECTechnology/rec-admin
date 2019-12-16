
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from 'src/services/company/company.service';
import { Document } from 'src/shared/entities/document.ent';

@Injectable()
export class LemonwayDocumentCrud extends CrudBaseService<Document> {

    public pdfHtml: string = '';

    constructor(
        http: HttpClient,
        public us: UserService,
        public cs: CompanyService,
    ) {
        super(http, us);
        this.basePath = '/lemon_documents';
        this.userRole = 'admin';
        this.mapItems = true;
    }

    public mapper(item) {
        return new Document(item);
    }
}
