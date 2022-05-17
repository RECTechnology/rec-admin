import { Component } from '@angular/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDia } from '../../add-item/add-item.dia';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Activity } from 'src/shared/entities/translatable/activity.ent';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivitiesV3Crud } from '../../../../../../services/crud/activities/activitiesv3.crud';

@Component({
    selector: 'tab-activities',
    templateUrl: './activities.html',
})
export class ActivitiesTabComponent extends EntityTabBase<Activity> {
    public activities: Activity[] = [];
    public loading = true;
    public entityName = 'Activity';

    constructor(
        public route: ActivatedRoute,
        public crud: ActivitiesCrud,
        public crudV3: ActivitiesV3Crud,
        public dialog: MatDialog,
        public alerts: AlertsService,
        public router: Router,
    ) {
        super(router);
        this.search();
    }

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
                this.list.updateData(this.data, resp.data.total);
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            },
        );
    }

    public editActivities(activity) {

        this.confirm('WARNING', 'ACTIVITY_DESC', 'Edit', 'warning')
            .subscribe((proceed) => {
                if (proceed) {
                    this.alerts.openModal(AddItemDia, {
                        isEdit: true,
                        item: Object.assign({}, activity),
                        itemType: 'ACTIVITY',
                    }).subscribe((updated) => {
                        if (updated) {
                            this.loading = true;
                            this.crudV3.update(activity.id, {
                                name_ca: updated.name_ca,
                                name_es: updated.name_es,
                                name: updated.name,
                                parent_id: updated.parent_id,
                                upc_code: updated.upc_code,
                            }, 'en').subscribe(
                                (resp) => {
                                    this.alerts.showSnackbar('Updated Activity', 'ok');
                                    this.search();
                                    this.loading = false;
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

    public addActivity() {
        this.alerts.openModal(AddItemDia, {
            isEdit: false,
            itemType: 'ACTIVITY',
        }).subscribe((created) => {
            if (created) {
                this.loading = true;
                this.crudV3.create({
                    name: created.name,
                    name_es: created.name_es,
                    name_ca: created.name_ca,
                    parent_id: created.parent_id,
                    description: '',
                    upc_code: created.upc_code,
                }, 'en')
                    .subscribe(
                        (act) => {
                            this.alerts.showSnackbar('Created Activity', 'ok');
                            this.search();
                            this.loading = false;
                        },
                        (error) => {
                            this.alerts.showSnackbar(error.message);
                            this.loading = false;
                        },
                    );
            }
        });
    }

    public deleteActivity(activity) {
        this.confirm('DELETE_ACTIVITY?', 'SURE_DELETE_THAT')
            .subscribe(
                (del) => {
                    if (del) {
                        this.crudV3.remove(activity.id).subscribe(
                            (resp) => {
                                this.alerts.showSnackbar('Deleted Activity', 'ok');
                                this.search();
                            },
                            (error) => this.alerts.showSnackbar(error.message),
                        );
                    }
                },
            );
    }
}
