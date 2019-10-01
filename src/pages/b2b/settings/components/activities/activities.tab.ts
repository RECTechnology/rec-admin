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
                            const proms = [
                                this.activitiesCrud.update(activity.id, { name: updated.cat }, 'ca'),
                                this.activitiesCrud.update(activity.id, { name: updated.esp }, 'es'),
                                this.activitiesCrud.update(activity.id, { name: updated.eng }, 'en'),
                            ];

                            forkJoin(proms).subscribe(
                                (resp) => {
                                    this.alerts.showSnackbar('Updated Activity: ' + activity.id, 'ok');
                                    this.search();
                                },
                                (error) => this.alerts.showSnackbar(error.message),
                            );
                        }
                    });
                }
            });
    }

    public addActivity() {
        const ref = this.alerts.openModal(AddItemDia, {
            isEdit: false,
            itemType: 'ACTIVITY',
        }).subscribe((created) => {
            if (created) {
                this.activitiesCrud.create({ name: created.eng, description: '' }, 'en')
                    .subscribe(
                        (act) => {
                            const proms = [
                                this.activitiesCrud.update(act.data.id, { name: created.cat }, 'ca'),
                                this.activitiesCrud.update(act.data.id, { name: created.esp }, 'es'),
                            ];

                            return forkJoin(proms).subscribe((resp) => {
                                this.alerts.showSnackbar('Created Activity', 'ok');
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
