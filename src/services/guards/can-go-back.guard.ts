import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertsService } from '../alerts/alerts.service';

export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
    onNavigateAway?: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

    constructor(
        public alerts: AlertsService,
    ) { }

    public canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
        // if there are no pending changes, just allow deactivation; else confirm first
        return new Observable((observer) => {
            const canIt = component.canDeactivate();

            if (!canIt) {
                this.showAlert().subscribe((resp) => {
                    observer.next(resp);
                    if (resp) {
                        component.onNavigateAway();
                    }
                });
            } else {
                observer.next(true);
            }
        });
    }

    public showAlert() {
        return this.alerts.showConfirmation(
            'WARNING: You have unsaved changes or content is empty. Press Cancel to go back\
             and save these changes, or Exit to lose these changes.',
            'Confirm',
            'Exit',
            'warning',
        );
    }
}
