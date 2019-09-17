import { Component } from '@angular/core';
import { NeighborhoodsCrud } from 'src/services/crud/neighborhoods/neighborhoods.crud';
import { EntityTabBase } from '../base.tab';
import { TlItemOption, TableListOptions, TlHeader } from 'src/components/table-list/tl-table/tl-table.component';
import { TableListHeaderOptions } from 'src/components/table-list/tl-header/tl-header.component';
import { MatDialog } from '@angular/material';
import { AddNeighbourhoodDia } from './add/add.dia';
import { MySnackBarSevice } from 'src/bases/snackbar-base';

@Component({
    selector: 'tab-neighborhoods',
    templateUrl: './neighborhoods.html',
})
export class NeighborhoodsTabComponent extends EntityTabBase {
    public data = [];
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
        public nCrud: NeighborhoodsCrud,
        public dialog: MatDialog,
        public snackbar: MySnackBarSevice,
    ) { super(dialog); }

    public search(query?) {
        this.loading = true;
        this.nCrud.search({
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
                    const ref = this.dialog.open(AddNeighbourhoodDia);
                    ref.componentInstance.isEdit = true;
                    ref.componentInstance.item = Object.assign({}, neighborhood);

                    ref.afterClosed().subscribe((updated) => {
                        if (updated) {

                            delete updated.id;
                            delete updated.created;
                            delete updated.updated;
                            delete updated.accounts;
                            delete updated.translations;

                            this.nCrud.update(neighborhood.id, updated).subscribe(
                                (resp) => {
                                    this.snackbar.open('Updated Neighbourhood: ' + neighborhood.id, 'ok');
                                    this.search();
                                },
                                (error) => this.snackbar.open(error.message),
                            );
                        }
                    });

                }
            });
    }

    public addNeighborhood() {
        const ref = this.dialog.open(AddNeighbourhoodDia);
        ref.componentInstance.isEdit = false;
        ref.afterClosed().subscribe((created) => {
            if (created) {
                this.nCrud.create(created).subscribe(
                    (resp) => {
                        this.snackbar.open('Created Neighbourhood', 'ok');
                        this.search();
                    },
                    (error) => this.snackbar.open(error.message),
                );
            }
        });
    }

    public deleteNeighborhood(neighborhood) {
        this.confirm('Delete Neighborhood ' + neighborhood.id, 'Are you sure you want to delete that? No going back.')
            .subscribe(
                (del) => {
                    if (del) {
                        this.nCrud.remove(neighborhood.id).subscribe(
                            (resp) => {
                                this.snackbar.open('Deleted Neighbourhood', 'ok');
                                this.search();
                            },
                            (error) => this.snackbar.open(error.message),
                        );
                    }
                },
            );
    }
}
