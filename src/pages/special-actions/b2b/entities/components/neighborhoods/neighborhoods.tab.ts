import { TlHeaders } from 'src/data/tl-headers';
import { Component } from '@angular/core';
import { NeighborhoodsCrud } from 'src/services/crud/neighborhoods/neighborhoods.crud';
import { EntityTabBase } from '../base.tab';
import {
    TlItemOption,
    TableListOptions,
    TlHeader,
} from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { MatDialog } from '@angular/material/dialog';
import { AddNeighbourhoodDia } from './add/add.dia';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Neighborhood } from 'src/shared/entities/translatable/neighborhood.ent';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ActivatedRoute, Router } from '@angular/router';

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
        public router: Router,
        public route: ActivatedRoute,
    ) { super(router); }
    ngOnInit(){
        this.route.queryParams.subscribe((params) => {

         
            this.limit = params.limit ?? 10;
            this.offset = params.offset;
            this.sortDir = params.sortDir;
            this.sortID = params.sortID;
            this.query = params.query;
          });
          
    }
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
    

    public editNeighborhood(neighborhood, skip= false) {
        this.confirm('WARNING', 'ACTIVITY_DESC', 'Edit', 'warning', skip).subscribe((proceed) => {
            if (proceed) {
              this.alerts
                .openModal(AddNeighbourhoodDia, {
                  isEdit: true,
                  isProduct: true,
                  item: Object.assign({}, neighborhood),
                  itemType: 'PRODUCT',
                })
                .subscribe((updated) => {
                  if (updated) {
                    this.loading = true;
                    this.crud
                      .update(
                        neighborhood.id,
                        {
                          name: updated.name,
                          description: updated.description,
                        },
                        'en',
                      )
                      .subscribe(
                        (resp) => {
                          this.alerts.showSnackbar('UPDATED_PRODUCT' + neighborhood.id, 'ok');
                          this.loading = false;
                          this.search();
                        },
                        (error) => {
                          this.alerts.showSnackbar(error.message);
                          this.loading = false;
                        },
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
                                this.alerts.showSnackbar('CREATED_PRODUCT', 'ok');
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
