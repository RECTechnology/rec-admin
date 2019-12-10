import { Component, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '../../../../../services/utils/utils.service';
import { Sort } from '@angular/material';

@Component({
    selector: 'delegate-header',
    styleUrls: [
        './delegate_header.css',
    ],
    templateUrl: './delegate_header.html',
})
export class DelegateHeaderComponent {
    public searchQuery: string = '';

    @Output('onSearch') public onSearch: EventEmitter<any>;
    @Output('onNewChange') public onNewChange: EventEmitter<any>;
    @Output('onImport') public onImport: EventEmitter<any>;

    public newChangeShown = false;
    public schedule = null;
    public date = null;
    public time = null;

    constructor(public utils: UtilsService) {
        this.onSearch = new EventEmitter();
        this.onNewChange = new EventEmitter();
        this.onImport = new EventEmitter();
    }

    public search() {
        this.onSearch.emit(this.searchQuery);
    }

    public showNewChange() {
        this.newChangeShown = true;
        const now = new Date();
        const parts = this.utils.parseDateToParts(now);
        this.date = parts.dateStr;
        this.time = parts.timeStr;
    }

    public hideNewChange() {
        this.newChangeShown = false;
    }

    public newChange() {
        if (this.time && this.date) {
            this.schedule = new Date(this.date + ' ' + this.time).toISOString();
        }
        this.onNewChange.emit(this.schedule);
        this.hideNewChange();
    }

    public newImport() {
        this.onImport.emit();
    }
}
