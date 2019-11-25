
import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from 'src/services/company/company.service';
import { Tier } from 'src/shared/entities/tier.ent';

@Injectable()
export class TiersCrud extends CrudBaseService<Tier> {

    public pdfHtml: string = '';

    constructor(
        http: HttpClient,
        public us: UserService,
        public cs: CompanyService,
    ) {
        super(http, us);
        this.basePath = '/tiers';
        this.userRole = 'admin';
        this.mapItems = true;
    }

    public mapper(item) {
        return new Tier(item);
    }

    public addDocumentKind(tier_id, doc_kind_id) {
        const url = [...this.getUrlBase(), '/', tier_id, '/', 'document_kinds'];
        return this.post(url, { id: doc_kind_id }).pipe(this.itemMapper());
    }
}
