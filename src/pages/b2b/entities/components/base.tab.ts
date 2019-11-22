import { MatDialog, Sort } from '@angular/material';
import { ViewChild } from '@angular/core';
import { TranslatableListComponent } from '../../components/translatable-list/translatable-list.component';
import { Observable } from 'rxjs';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { CrudBaseService } from 'src/services/base/crud.base';

export abstract class EntityTabBase<T> {
    public query: string = '';
    public limit = 10;
    public offset = 0;
    public total = 0;
    public sortDir = 'asc';
    public sortID = 'id';
    public loading = false;

    public data: T[] = [];
    public sortedData: T[] = [];

    public editComponent: any;
    public addComponent: any;

    @ViewChild(TranslatableListComponent, { static: true }) public list: TranslatableListComponent;

    public dialog: MatDialog;
    public alerts: AlertsService;
    public crud: CrudBaseService<T>;

    public abstract entityName: string;
    public abstract search(): any;

    public ngAfterViewInit() {
        // this.search();
    }

    public confirm(title, message, btnText = 'Delete', status = 'error', skip = false, icon = 'warning') {
        if (skip) {
            return new Observable((obs) => {
                obs.next(true);
                obs.complete();
            });
        }
        return this.alerts.showConfirmation(message, title, btnText, status, icon);
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

    public addItem() {
        this.alerts.openModal(this.addComponent)
            .subscribe(this.search.bind(this));
    }

    public editItem(item: T) {
        this.alerts.openModal(this.editComponent, { isEdit: true, item: Object.assign({}, item) })
            .subscribe(this.search.bind(this));
    }

    public deleteItem(item: T | any) {
        if (this.loading) {
            return;
        }

        this.loading = true;
        this.alerts.confirmDeletion(this.entityName)
            .subscribe((confirm) => {
                if (!confirm) {
                    this.loading = false;
                    return;
                }

                this.loading = true;
                this.crud.remove(item.id)
                    .subscribe((resp) => {
                        this.alerts.showSnackbar('Removed ' + this.entityName + ' correctly!', 'ok');
                        this.loading = false;
                        this.search();
                    }, (err) => {
                        this.alerts.showSnackbar(err.message, 'ok');
                        this.loading = false;
                    });
            });

    }
}