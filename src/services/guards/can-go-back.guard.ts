import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertsService } from '../alerts/alerts.service';
import { UnsavedChangesDialog } from 'src/dialogs/unsaved-changes/unsaved-changes.dia';
export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
    onSaveDraft: () => any;
    onDiscard: () => any;
    onContinueEditing?: () => any;
    title: string;
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
    public isOpened = false;
    constructor(
        public alerts: AlertsService,
    ) { }

    public canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
        // if there are no pending changes, just allow deactivation; else confirm first
        return new Observable((observer) => {
            const canIt = component.canDeactivate();
            const title = component.title;

            if (!canIt && !this.isOpened) {
                this.isOpened = true;
                this.showAlert(title).afterClosed()
                    .subscribe((resp) => {
                        if (resp === 'save' && typeof component.onSaveDraft === 'function') {
                            component.onSaveDraft();
                            observer.next(true);
                        } else if (resp === 'discard' && typeof component.onDiscard === 'function') {
                            component.onDiscard();
                            observer.next(true);
                        } else if (resp === 'continue' && typeof component.onContinueEditing === 'function') {
                            component.onContinueEditing();
                            observer.next(false);
                        }

                        this.isOpened = false;
                    });
            } else if (!this.isOpened) {
                observer.next(true);
            }
        });
    }

    public showAlert(title) {
        const ref: any = this.alerts.createModal(UnsavedChangesDialog);
        ref.componentInstance.title = title;
        return ref;
    }
}
