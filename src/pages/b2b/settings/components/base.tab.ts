import { MatDialog, Sort } from '@angular/material';
import { ConfirmationMessage } from 'src/components/dialogs/confirmation-message/confirmation.dia';
import { ViewChild } from '@angular/core';
import { TranslatableListComponent } from '../../components/translatable-list/translatable-list.component';
import { Observable } from 'rxjs';

export abstract class EntityTabBase {
    public query: string = '';
    public limit = 10;
    public offset = 0;
    public total = 0;
    public sortDir = 'asc';
    public sortID = 'id';
    public loading = false;

    public data: any[] = [];
    public sortedData: any[] = [];

    @ViewChild(TranslatableListComponent, { static: true }) public list: TranslatableListComponent;

    constructor(public dialog: MatDialog) { }
    public abstract search(): any;

    public ngAfterViewInit() {
        this.search();
    }

    public confirm(title, message, btnText = 'Delete', status = 'error', skip = false) {
        if (skip) {
            return new Observable((obs) => {
                obs.next(true);
                obs.complete();
            });
        }
        const dialogRef = this.dialog.open(ConfirmationMessage);
        dialogRef.componentInstance.status = status;
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.btnConfirmText = btnText;
        dialogRef.componentInstance.headerIcon = 'warning';

        return dialogRef.afterClosed();
    }

    public sortData(sort: Sort): void {
        if (!sort.active || sort.direction === '') {
            this.sortedData = this.data.slice();
            this.sortID = 'id';
            this.sortDir = 'desc';
        } else {
            this.sortID = sort.active;
            this.sortDir = sort.direction;
        }
        this.search();
    }

    public changedPage($event) {
        this.limit = $event.pageSize;
        this.offset = this.limit * ($event.pageIndex);
        this.search();
    }

    public mapTranslatedElement(elem) {
        elem.eng = elem.translations && elem.translations.en ? elem.translations.en.name : '';
        elem.cat = elem.translations && elem.translations.ca ? elem.translations.ca.name : '';
        elem.esp = elem.translations && elem.translations.es ? elem.translations.es.name : '';
        return elem;
    }
}
