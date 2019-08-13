import { Component } from '@angular/core';
import { ActivitiesCrud } from 'src/services/crud/activities/activities.crud';
import { EntityTabBase } from '../base.tab';

@Component({
    selector: 'tab-activities',
    templateUrl: './activities.html',
})
export class ActivitiesTabComponent extends EntityTabBase {
    public activities = [];

    constructor(
        public activitiesCrud: ActivitiesCrud,
    ) { super(); }

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
                this.activities = resp;
            },
            (error) => {
                console.log('errror', error);
            },
        );
    }

    public editActivities($event) { }

    public addActivity() { }

    public deleteActivity($event) { }
}
