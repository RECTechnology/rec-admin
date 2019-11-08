import { Component, OnInit, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { Sort, SortDirection } from '@angular/material';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

export interface TlHeader {
    sort: string;
    sortable?: boolean;
    title: string;
    type?: 'text' | 'checkbox' | 'status' | 'code' | 'date' | 'avatar' | 'button' | 'slidetoggle';
    accessor?: string | ((el: any) => any);
    statusClass?: ((status: string) => any);
    avatar?: TlHeader;
    buttonAction?: (any) => any;
    buttonImg?: string;
    slideAction?: (any) => any;
}

export interface TlItemOption {
    text: string | ((el: any) => string);
    callback: (any) => any;
    class?: string;
    icon?: string;
    disabled?: boolean | ((el: any) => any);
}

export interface TableListOptions {
    optionsType: 'menu' | 'buttons';
}

@Component({
    selector: 'tl-table',
    templateUrl: './tl-table.html',
})
export class TableListTable implements AfterContentInit {
    @Input() public data: any[] = [];
    @Input() public headers: TlHeader[];
    @Input() public sort: boolean = false;
    @Input() public loading: boolean = false;
    @Input() public showLoader: boolean = true;
    @Input() public showPaginator: boolean = true;
    @Input() public itemOptions: TlItemOption[];
    @Input() public noItemsMessage: string = 'NO_ITEMS';
    @Input() public options: TableListOptions = {
        optionsType: 'menu',
    };

    @Input() public total: number = 0;
    @Input() public limit: number = 0;

    @Output() public onSort: EventEmitter<Sort>;
    @Output() public onChangePage: EventEmitter<Sort>;

    public Brand: any = environment.Brand;

    public sortDir: string;
    public sortId: string;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
    ) {
        this.onSort = new EventEmitter<Sort>();
        this.onChangePage = new EventEmitter<Sort>();
    }

    public ngAfterContentInit() {
        // Gets the query parameters and gets 'tab' param
        this.route.queryParams
            .subscribe((params) => {
                this.sortDir = params.dir;
                this.sortId = params.sort;
                if (this.sortDir || this.sortId) {
                    this.onSort.emit({
                        active: this.sortId,
                        direction: this.sortDir as SortDirection,
                    });
                }
            });
    }

    public getEntry(entry, header: TlHeader) {
        if (!header.accessor) {
            return entry[header.sort];
        } else if (typeof header.accessor === 'string') {
            return entry[header.accessor];
        } else if (typeof header.accessor === 'function') {
            return header.accessor(entry);
        }
    }

    public trackByFn(index, item) {
        return index; // or item.id
    }

    public sortData(sort: Sort): void {
        if (!sort.active || sort.direction === '') {
            this.router.navigate([], { queryParams: { sort: 'id', dir: 'desc' }, queryParamsHandling: 'merge' });
        } else {
            this.router.navigate([], {
                queryParams: { sort: sort.active, dir: sort.direction },
                queryParamsHandling: 'merge',
            });
        }
        this.onSort.emit(sort);
    }

    public changedPage($event) {
        this.onChangePage.emit($event);
    }

    public getOptionText(option, el?) {
        if (typeof option.text === 'function') {
            return option.text(el);
        } else if (typeof option.text === 'string') {
            return option.text;
        } else {
            return option.text;
        }
    }

    public isOptionDisabled(option, el) {
        if (typeof option.disabled === 'function') {
            return option.disabled(el);
        } else if (typeof option.disabled === 'string') {
            return el[option.disabled];
        } else {
            return false;
        }
    }
}
