import { Component } from '@angular/core';
import { EntityTabBase } from '../base.tab';
import { MatDialog, MatSort } from '@angular/material';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/services/user.service';
import { TlHeader } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TiersCrud } from 'src/services/crud/tiers/tiers.crud';
import { Tier } from 'src/shared/entities/tier.ent';
import { AddTierDia } from 'src/dialogs/entities/add-tier/add-tier.dia';
import { TlHeaders } from 'src/data/tl-headers';

@Component({
    selector: 'tab-tiers',
    templateUrl: './tiers.html',
})
export class TiersTabComponent extends EntityTabBase<Tier> {
    public entityName = 'Tier';
    public headers: TlHeader[] = [
        TlHeaders.Id,
        TlHeaders.generate('code'),
        TlHeaders.generate('previous', {
            accessor(el) {
                return el.previous ? (el.previous).code : '';
            },
            type: 'code',
        }),
        TlHeaders.generate('next', {
            accessor(el) {
                return el.next ? (el.next).code : '';
            },
            type: 'code',
        }),
        TlHeaders.Description,
    ];

    public addComponent = AddTierDia;
    public editComponent = AddTierDia;

    constructor(
        public crud: TiersCrud,
        public dialog: MatDialog,
        public alerts: AlertsService,
        public translate: TranslateService,
        public us: UserService,
    ) {
        super();
        this.translate.onLangChange.subscribe(() => {
            this.search();
        });
    }

    public sortData(sort: MatSort) {
        super.sortData(sort);
    }

    public search(query?) {
        this.loading = true;
        this.crud.search({
            order: this.sortDir,
            limit: this.limit,
            offset: this.offset,
            search: query || this.query || '',
            sort: this.sortID,
        }).subscribe(
            (resp) => {
                this.data = resp.data.elements;
                this.sortedData = this.data.slice();
                this.total = resp.data.total;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            },
        );
    }
}
