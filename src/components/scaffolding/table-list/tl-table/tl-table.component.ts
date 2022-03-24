import { Component, Input, Output, EventEmitter, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';
import { Sort, SortDirection } from '@angular/material/sort';
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
    avatar?: TlHeader;
    image?: TlHeader;
    translate?: boolean;
    buttonImg?: string;
    suffix?: string;
    preffix?: string;
    statusClass?: ((status: any) => any);
    link?: (any) => any;
    buttonAction?: (any) => any;
    slideAction?: (any) => any;
    tooltip?: (any) => any;
}
export class TlHeader implements TlHeader {
    constructor(opts: Partial<TlHeader>) {
        // tslint:disable-next-line: forin
        for (const prop in opts) {
            this[prop] = opts[prop];
        }
    }

    public extend?(opts: Partial<TlHeader>) {
        // tslint:disable-next-line: forin
        for (const prop in opts) {
            this[prop] = opts[prop];
        }

        return new TlHeader(this);
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
    getRowClass?: (entry: any) => string;
    onClick?: (entry: any) => void;
    onClickElement?: (entry: any) => void;
}

@Component({
    selector: 'tl-table',
    templateUrl: './tl-table.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    @Input() public options: TableListOptions = {};
    @Input() public total: number = 0;
    @Input() public limit: number = 0;
    @Input() public pageIndex: number = 0;

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

    public ngOnInit() {
        this.options = {
            optionsType: 'menu',
            sortEnabled: true,
            ...this.options,
        };
    }

    public onClickedRow(entry: any) {
        if (this.options.onClick) {
            this.options.onClick(entry);
        }
    }
    public onClickedItemUser(entry: any) {
        if (this.options.onClickElement) {
            const user = entry.user ?? entry.kyc_manager;
            this.options.onClickElement(`/users/${user.id}`);
        }
    }
    public onClickedItemAccount(entry: any) {
        if (this.options.onClickElement) {
            this.options.onClickElement(`/accounts/edit/${entry.account.id}`);
        }
    }
    public getRowClass(entry: any) {
        if (this.options.getRowClass) {
            return this.options.getRowClass(entry);
        }
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

    public getEntry(entry, header: TlHeader, translate = true, string: String = '') {
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
        return item.id;
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
        this.router.navigate([data.link], {
            queryParams: data.params,
            queryParamsHandling: 'merge',
            preserveQueryParams: true,
        });
    }
}