
import { Injectable } from '@angular/core';
import { CrudBaseService, CrudQueryOptions } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from 'src/services/company/company.service';
import { Tier } from 'src/shared/entities/tier.ent';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';

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

    public listInOrder(opts: CrudQueryOptions): Observable<any> {
        return this.list(opts).pipe(map((el) => {
            const tiers = el.data.elements;
            const sorted = [];
            const tierMap = {};
            let prevTier;

            const sortTier = (tier) => {
                if (tierMap[tier.id] || !tier.previous || !tier.next) {
                    return;
                } else {
                    tierMap[tier.id] = tier;

                    if (prevTier && prevTier.id === tier.prev) {
                        sorted.push(tier);
                    }

                    if (tier.previous) { sortTier(tier.previous); }
                }
            };

            prevTier = null;
            sortTier(tiers[0]);

            return tiers.reverse();
        }));
    }

    public unsetDocumentKind(dock_id, tier_id) {
        const url = [...this.getUrlBase(), '/', tier_id, '/', 'document_kinds', '/', dock_id];
        return this.delete(url);
    }

    public setDocumentKind(tier_id: any, document_kind_id: any) {
        const url = [...this.getUrlBase(), '/', tier_id, '/', 'document_kinds'];
        return this.post(url, { id: document_kind_id }).pipe(this.itemMapper());
    }
}
