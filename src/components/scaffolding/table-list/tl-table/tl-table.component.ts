import { Component, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { Sort, SortDirection } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export type TlHeaderType = (
    'text' | 'checkbox' | 'status' |
    'code' | 'date' | 'avatar' |
    'button' | 'slidetoggle' |
    'image' | 'number' | 'link'
);

export interface TlHeader {
    sort?: string | boolean;
    sortable?: boolean;
    title: string;
    type?: TlHeaderType;
    accessor?: string | ((el: any) => any);
    statusClass?: ((status: string) => any);
    link?: (any) => any;
    avatar?: TlHeader;
    image?: TlHeader;
    translate?: boolean;
    buttonImg?: string;
    suffix?: string;
    preffix?: string;
    buttonAction?: (any) => any;
    slideAction?: (any) => any;
    tooltip?: (any) => any;
}
export class TlHeader implements TlHeader {
    constructor(opts: TlHeader) {
        this.extend(opts);
    }

    public extend?(opts: TlHeader) {
        // tslint:disable-next-line: forin
        for (const prop in opts) {
            this[prop] = opts[prop];
        }

        return this;
    }
}

export interface TlItemOption {
    text?: string | ((el: any) => string);
    callback?: (any) => any;
    class?: string;
    icon?: string;
    disabled?: boolean | ((el: any) => any);
    ngIf?: boolean | ((el: any) => any);
}
export class TlItemOption implements TlItemOption {
    constructor(opts: TlItemOption) {
        this.extend(opts);
    }

    public extend?(opts: TlItemOption) {
        // tslint:disable-next-line: forin
        for (const prop in opts) {
            this[prop] = opts[prop];
        }

        return this;
    }
}

export interface TableListOptions {
    optionsType?: 'menu' | 'buttons';
    sortEnabled?: boolean;
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
        sortEnabled: true,
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
        public translate: TranslateService,
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

    public getEntry(entry, header: TlHeader, translate = true) {
        let val = '';
        if (!header.accessor && header.sort) {
            val = entry[header.sort as any];
        } else if (typeof header.accessor === 'string') {
            val = entry[header.accessor];
        } else if (typeof header.accessor === 'function') {
            val = header.accessor(entry);
        }

        const resVal = (translate && header.translate) ? this.translate.instant(val) : val;
        return resVal;
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

    public isEnabled(option, entry) {
        if (option.ngIf && typeof option.ngIf === 'function') {
            return option.ngIf(entry);
        }
        return true;
    }

    public navigateTo(data: { link?: string, params?: any } = {}) {
        console.log('navigateTo', data);
        this.router.navigate([data.link], {
            queryParams: data.params,
            queryParamsHandling: 'merge',
            preserveQueryParams: true,
        });
    }
}
