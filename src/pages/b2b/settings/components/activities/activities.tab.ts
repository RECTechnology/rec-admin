import { Component } from '@angular/core';

@Component({
    selector: 'tab-activities',
    templateUrl: './activities.html',
})
export class ActivitiesTabComponent {
    public activities = [];

    public editActivities($event) { }

    public addActivity() { }

    public deleteActivity($event) { }
}
