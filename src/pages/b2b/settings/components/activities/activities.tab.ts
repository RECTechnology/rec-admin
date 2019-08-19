import { Component } from '@angular/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { AddItemDia } from '../../add-item/add-item.dia';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'tab-activities',
    templateUrl: './activities.html',
})
export class ActivitiesTabComponent extends EntityTabBase {
    public activities = [];

    constructor(
        public activitiesCrud: ActivitiesCrud,
        public dialog: MatDialog,
        public snackbar: MySnackBarSevice,
    ) {
        super(dialog);
    }

    public search() {
        this.activitiesCrud.search({
            limit: this.limit,
            offset: this.offset,
            query: {
                search: this.query,
            },
        }).subscribe(
            (resp) => {
                console.log('activities', resp);
                this.data = resp.data.elements.map((elem) => {
                    elem.eng = elem.name;
                    return elem;
                });
                this.sortedData = this.data.slice();

                console.log('sorted', this.sortedData);

                this.total = resp.data.total;
            },
            (error) => {
                console.log('errror', error);
            },
        );
    }

    public editActivities(activity) {
        const ref = this.dialog.open(AddItemDia);
        ref.componentInstance.isEdit = true;
        ref.componentInstance.item = Object.assign({}, activity);

        ref.afterClosed().subscribe((updated) => {
            if (updated) {
                delete updated.id;
                delete updated.created;
                delete updated.updated;

                this.activitiesCrud.update(activity.id, updated).subscribe(
                    (resp) => {
                        this.snackbar.open('Updated Activity: ' + activity.id, 'ok');
                        this.search();
                    },
                    (error) => this.snackbar.open(error.message),
                );
            }
        });
    }

    public addActivity() {
        const ref = this.dialog.open(AddItemDia);
        ref.componentInstance.isEdit = false;

        ref.afterClosed().subscribe((created) => {
            if (created) {
                delete created.activities_consumed;
                delete created.activities_produced;

                this.activitiesCrud.create({ name: created.eng, description: '' }, 'en')
                    .subscribe(
                        (act) => {
                            const proms = [
                                this.activitiesCrud.update(act.data.id, { name: created.cat }, 'ca'),
                                this.activitiesCrud.update(act.data.id, { name: created.esp }, 'es'),
                            ];

                            return forkJoin(proms).subscribe((resp) => {
                                this.snackbar.open('Created Activity: ' + act.id, 'ok');
                                this.search();
                            });
                        },
                        (error) => {
                            console.log(error);
                            this.snackbar.open(error.message);
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
                                this.snackbar.open('Deleted Activity', 'ok');
                                this.search();
                            },
                            (error) => this.snackbar.open(error.message),
                        );
                    }
                },
            );
    }
}
