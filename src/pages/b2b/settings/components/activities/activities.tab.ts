import { Component } from '@angular/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material';
import { AddItemDia } from '../../add-item/add-item.dia';
import { forkJoin } from 'rxjs';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
    selector: 'tab-activities',
    templateUrl: './activities.html',
})
export class ActivitiesTabComponent extends EntityTabBase {
    public activities = [];
    public loading = true;

    constructor(
        public activitiesCrud: ActivitiesCrud,
        public dialog: MatDialog,
        public alerts: AlertsService,
    ) {
        super(dialog, alerts);
    }

    public search() {
        this.loading = true;
        this.activitiesCrud.search({
            dir: this.sortDir,
            limit: this.limit,
            offset: this.offset,
            search: this.query || '',
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
                    const ref = this.alerts.openModal(AddItemDia, {
                        isEdit: true,
                        item: Object.assign({}, activity),
                        itemType: 'ACTIVITY',
                    }).subscribe((updated) => {
                        if (updated) {
                            this.loading = true;
                            this.activitiesCrud.update(activity.id, {
                                name_ca: updated.name_ca,
                                name_es: updated.name_es,
                                name: updated.name,
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
                this.activitiesCrud.create({
                    name: created.name,
                    name_es: created.name_es,
                    name_ca: created.name_ca,
                    description: '',
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
                        this.activitiesCrud.remove(activity.id).subscribe(
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
