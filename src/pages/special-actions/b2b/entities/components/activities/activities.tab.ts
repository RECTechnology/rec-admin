import { Component } from '@angular/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDia } from '../../add-item/add-item.dia';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Activity } from 'src/shared/entities/translatable/activity.ent';

@Component({
    selector: 'tab-activities',
    templateUrl: './activities.html',
})
export class ActivitiesTabComponent extends EntityTabBase<Activity> {
    public activities: Activity[] = [];
    public loading = true;
    public entityName = 'Activity';

    constructor(
        public crud: ActivitiesCrud,
        public dialog: MatDialog,
        public alerts: AlertsService,
    ) {
        super();
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
                this.data = resp.data.elements.map(this.mapTranslatedElement);
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
                            this.crud.update(activity.id, {
                                name_ca: updated.name_ca,
                                name_es: updated.name_es,
                                name: updated.name,
                                parent_id: updated.parent_id,
                                upc_code: updated.upc_code,
                            }, 'en').subscribe(
                                (resp) => {
                                    this.alerts.showSnackbar('Updated Activity: ' + activity.id, 'ok');
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
                this.crud.create({
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
        this.confirm('Delete Activity ' + activity.id, 'Are you sure you want to delete that? No going back.')
            .subscribe(
                (del) => {
                    if (del) {
                        this.crud.remove(activity.id).subscribe(
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
