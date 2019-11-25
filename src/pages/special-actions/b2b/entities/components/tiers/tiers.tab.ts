import { Component } from '@angular/core';
import { EntityTabBase } from '../base.tab';
import { MatDialog, MatSort } from '@angular/material';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/services/user.service';
import {
    TlHeader, TlItemOption, TableListOptions,
} from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { TiersCrud } from 'src/services/crud/tiers/tiers';
import { Tier } from 'src/shared/entities/tier.ent';
import { AddTierDia } from 'src/dialogs/entities/add-tier/add-tier.dia';
import { TlHeaders } from 'src/data/tl-headers';
import { TlItemOptions } from 'src/data/tl-item-options';

@Component({
    selector: 'tab-tiers',
    templateUrl: './tiers.html',
})
export class TiersTabComponent extends EntityTabBase<Tier> {
    public entityName = 'Tier';
    public headers: TlHeader[] = [
        TlHeaders.Id,
        TlHeaders.generate('code'),
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
