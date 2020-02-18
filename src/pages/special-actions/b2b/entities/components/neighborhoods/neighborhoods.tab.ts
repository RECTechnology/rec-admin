import { TlHeaders } from 'src/data/tl-headers';
import { Component } from '@angular/core';
import { NeighborhoodsCrud } from 'src/services/crud/neighborhoods/neighborhoods.crud';
import { EntityTabBase } from '../base.tab';
import { TlItemOption, TableListOptions, TlHeader } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { MatDialog } from '@angular/material/dialog';
import { AddNeighbourhoodDia } from './add/add.dia';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Neighborhood } from 'src/shared/entities/translatable/neighborhood.ent';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
    selector: 'tab-neighborhoods',
    templateUrl: './neighborhoods.html',
})
export class NeighborhoodsTabComponent extends EntityTabBase<Neighborhood> {
    public data: Neighborhood[] = [];
    public entityName = 'Neighborhood';
    public headerOpts: TableListHeaderOptions = { input: true };
    public headers: TlHeader[] = [
        TlHeaders.Id,
        {
            sort: 'townhall_code',
            title: 'Townhall ID',
            type: 'code',
        },
        TlHeaders.Name,
        TlHeaders.Description,
    ];

    public itemOptions: TlItemOption[] = [{
        callback: this.editNeighborhood.bind(this),
        icon: 'fa-edit',
        text: 'Edit Neighbourhood',
    }, {
        callback: this.deleteItem.bind(this),
        class: 'col-error',
        icon: 'fa-trash',
        text: 'Delete Neighbourhood',
    }];

    public tableOptions: TableListOptions = {
        optionsType: 'buttons',
    };

    public addComponent = AddNeighbourhoodDia;
    public editComponent = AddNeighbourhoodDia;

    constructor(
        public crud: NeighborhoodsCrud,
        public dialog: MatDialog,
        public alerts: AlertsService,
    ) { super(); }

    public search(query?) {
        this.loading = true;
        this.crud.search({
            dir: this.sortDir,
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

    public editNeighborhood(neighborhood) {
        this.confirm('WARNING', 'ACTIVITY_DESC', 'Edit', 'warning')
            .subscribe((proceed) => {
                if (proceed) {
                    this.editItem(neighborhood);
                }
            });
    }

    public addNeighborhood() {
        this.alerts.openModal(AddNeighbourhoodDia, {
            isEdit: false,
        }).subscribe((created) => {
            if (created) {
                this.crud.create(created, 'en')
                    .subscribe(
                        (prod) => {
                            const productID = prod.data.id;

                            const proms = [
                                this.crud.update(productID, { name: created.name }, 'ca'),
                                this.crud.update(productID, { name: created.name }, 'es'),
                            ];

                            return forkJoin(proms).subscribe((resp) => {
                                this.alerts.showSnackbar('Created Product', 'ok');
                                this.loading = false;
                                this.search();
                            });
                        },
                        (error) => {
                            this.alerts.showSnackbar(error.message);
                        },
                    );
            }
        });
    }
}
