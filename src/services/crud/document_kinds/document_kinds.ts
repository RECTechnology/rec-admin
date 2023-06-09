
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from 'src/services/company/company.service';
import { DocumentKind } from 'src/shared/entities/document_kind.ent';

@Injectable()
export class DocumentKindsCrud extends CrudBaseService<DocumentKind> {

    public pdfHtml: string = '';

    constructor(
        http: HttpClient,
        public us: UserService,
        public cs: CompanyService,
    ) {
        super(http, us);
        this.basePath = '/document_kinds';
        this.userRole = 'admin';
        this.mapItems = true;
    }

    public mapper(item) {
        return new DocumentKind(item);
    }

    public setTier(id, tier_id) {
        return this.update(id, { tier_id });
    }

    // public unsetTier(id) {
    //     return this.update(id, { tier_id: 'null' });
    // }

    // public unsetTier(dock_id, tier_id) {
    //     const url = [...this.getUrlBase(), '/', dock_id, '/', 'tier', '/', tier_id];
    //     return this.delete(url);
    // }

}
