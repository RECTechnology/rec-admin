import { Component } from '@angular/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { AddItemDia } from '../../add-item/add-item.dia';
import { forkJoin } from 'rxjs';
import { element } from 'protractor';

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
                console.log('RESP', resp);
                this.list.updateData(this.data, resp.data.total);
                this.loading = false;
            },
            (error) => {
                console.log('errror', error);
                this.loading = false;
            },
        );
    }

    public editActivities(activity) {
        this.confirm('WARNING', 'ACTIVITY_DESC', 'Edit', 'warning')
            .subscribe((proceed) => {
                if (proceed) {
                    const ref = this.dialog.open(AddItemDia);
                    ref.componentInstance.isEdit = true;
                    ref.componentInstance.item = Object.assign({}, activity);
                    ref.componentInstance.itemType = 'ACTIVITY';

                    ref.afterClosed().subscribe((updated) => {
                        if (updated) {
                            const proms = [
                                this.activitiesCrud.update(activity.id, { name: updated.cat }, 'ca'),
                                this.activitiesCrud.update(activity.id, { name: updated.esp }, 'es'),
                                this.activitiesCrud.update(activity.id, { name: updated.eng }, 'en'),
                            ];

                            forkJoin(proms).subscribe(
                                (resp) => {
                                    this.snackbar.open('Updated Activity: ' + activity.id, 'ok');
                                    this.search();
                                },
                                (error) => this.snackbar.open(error.message),
                            );
                        }
                    });
                }
            });
    }

    public addActivity() {
        const ref = this.dialog.open(AddItemDia);
        ref.componentInstance.isEdit = false;
        ref.componentInstance.itemType = 'ACTIVITY';

        ref.afterClosed().subscribe((created) => {
            if (created) {
                this.activitiesCrud.create({ name: created.eng, description: '' }, 'en')
                    .subscribe(
                        (act) => {
                            const proms = [
                                this.activitiesCrud.update(act.data.id, { name: created.cat }, 'ca'),
                                this.activitiesCrud.update(act.data.id, { name: created.esp }, 'es'),
                            ];

                            return forkJoin(proms).subscribe((resp) => {
                                this.snackbar.open('Created Activity', 'ok');
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
