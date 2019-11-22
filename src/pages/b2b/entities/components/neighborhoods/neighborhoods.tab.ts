import { Component } from '@angular/core';
import { NeighborhoodsCrud } from 'src/services/crud/neighborhoods/neighborhoods.crud';
import { EntityTabBase } from '../base.tab';
import { TlItemOption, TableListOptions, TlHeader } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { MatDialog } from '@angular/material';
import { AddNeighbourhoodDia } from './add/add.dia';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { CrudBaseService } from 'src/services/base/crud.base';
import { REC_LANGS } from 'src/types';
import { forkJoin } from 'rxjs';
import { Neighborhood } from 'src/shared/entities/translatable/neighborhood.ent';

@Component({
    selector: 'tab-neighborhoods',
    templateUrl: './neighborhoods.html',
})
export class NeighborhoodsTabComponent extends EntityTabBase<Neighborhood> {
    public data: Neighborhood[] = [];
    public entityName = 'Neighborhood';
    public headerOpts: TableListHeaderOptions = { input: true };
    public headers: TlHeader[] = [
        {
            sort: 'id',
            title: 'ID',
            type: 'code',
        },
        {
            sort: 'townhall_code',
            title: 'Townhall ID',
            type: 'code',
        },
        {
            accessor: 'name',
            sort: 'name',
            title: 'Name',
        },
        {
            accessor: 'description',
            sort: 'description',
            title: 'Description',
        },
    ];

    public itemOptions: TlItemOption[] = [{
        callback: this.editNeighborhood.bind(this),
        icon: 'fa-edit',
        text: 'Edit Neighbourhood',
    }, {
        callback: this.deleteNeighborhood.bind(this),
        class: 'col-error',
        icon: 'fa-trash',
        text: 'Delete Neighbourhood',
    }];

    public tableOptions: TableListOptions = {
        optionsType: 'menu',
    };

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
                    const ref = this.alerts.openModal(AddNeighbourhoodDia, {
                        isEdit: true,
                        item: Object.assign({}, neighborhood),
                    }).subscribe((updated) => {
                        if (updated) {

                            delete updated.id;
                            delete updated.created;
                            delete updated.updated;
                            delete updated.accounts;
                            delete updated.translations;
                            delete updated.bounds;

                            this.crud.update(neighborhood.id, updated).subscribe(
                                (resp) => {
                                    this.alerts.showSnackbar('Updated Neighbourhood: ' + neighborhood.id, 'ok');
                                    this.search();
                                },
                                (error) => this.alerts.showSnackbar(error.message),
                            );
                        }
                    });

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

    public deleteNeighborhood(neighborhood) {
        this.confirm('Delete Neighborhood ' + neighborhood.id, 'Are you sure you want to delete that? No going back.')
            .subscribe(
                (del) => {
                    if (del) {
                        this.crud.remove(neighborhood.id).subscribe(
                            (resp) => {
                                this.alerts.showSnackbar('Deleted Neighbourhood', 'ok');
                                this.search();
                            },
                            (error) => this.alerts.showSnackbar(error.message),
                        );
                    }
                },
            );
    }
}
