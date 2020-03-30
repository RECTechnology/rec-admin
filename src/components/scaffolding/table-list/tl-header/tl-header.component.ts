import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';

export interface TableListHeaderOptions {
    input?: boolean;
    refresh?: boolean;
    search?: boolean;
    newItem?: boolean;
    showOptions?: boolean;
    deepLinkQuery?: boolean;
}

const defaultOptions: TableListHeaderOptions = {
    input: true,
    search: false,
    refresh: true,
    newItem: false,
    showOptions: false,
    deepLinkQuery: false,
};

@Component({
    selector: 'tl-header',
    templateUrl: './tl-header.html',
})
export class TableListHeader {
    @Input() public options: TableListHeaderOptions = {};
    @Input() public title: string = 'TableList';
    @Input() public query: string = '';
    @Input() public searchPlaceholder: string = 'Search';
    @Input() public inputClass = 'input border-radius-2';

    @Input() public newItemText = '';
    @Input() public newItemIcon = 'fa-plus';
    @Input() public searching = false;

    @Output() public onSearch: EventEmitter<string>;
    @Output() public queryChange: EventEmitter<string>;
    @Output() public onAdd: EventEmitter<any>;

    @ViewChild('search') public searchElement: ElementRef;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
    ) {
        this.onSearch = new EventEmitter<string>();
        this.queryChange = new EventEmitter<string>();
        this.onAdd = new EventEmitter<any>();

        this.options = {
            ...defaultOptions,
            ...this.options,
        };
    }

    public ngOnInit() {
        setTimeout(() => {
            // Setup debounced search
            if (this.options.input) {
                this.setupDebouncedSearch(this.searchElement.nativeElement);
            }

            this.route.queryParams.subscribe((params) => {
                if (params.query) {
                    this.query = params.query;
                    if (this.searchElement.nativeElement.value !== this.query) {
                        this.searchElement.nativeElement.value = this.query;
                        this.searchElement.nativeElement.dispatchEvent(new Event('keyup'));
                    }
                } else {
                    this.search();
                }
            });
        }, 100);
    }

    public searchChanged() {
        this.queryChange.emit(this.query || '');
    }

    public search() {
        this.queryChange.emit(this.query || '');
        this.onSearch.emit(this.query || '');
    }

    public addItem() {
        this.onAdd.emit();
    }

    public setupDebouncedSearch(element) {
        fromEvent(element, 'keyup').pipe(
            map((event: any) => event.target.value),
            debounceTime(500),
            distinctUntilChanged(),
        ).subscribe((text: string) => {
            this.query = text;
            this.onSearch.emit(text);
            this.queryChange.emit(text);

            // Add query params for deeplinking
            if (this.options.deepLinkQuery) {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: {
                        query: this.query,
                    },
                    queryParamsHandling: 'merge',
                });
            }
        });
    }

}
