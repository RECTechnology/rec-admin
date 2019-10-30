import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface TableListHeaderOptions {
    input?: boolean;
    newItem?: boolean;
    showOptions?: boolean;
}

const defaultOptions: TableListHeaderOptions = {
    input: true,
    newItem: false,
    showOptions: false,
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

    @Output() public onSearch: EventEmitter<string>;
    @Output() public queryChange: EventEmitter<string>;
    @Output() public onAdd: EventEmitter<any>;

    @ViewChild('search', { static: false }) public searchElement: ElementRef;

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
        if (this.options.input) {
            setTimeout(() => {
                this.setupDebounce(this.searchElement.nativeElement);
            }, 100);
        }
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

    public setupDebounce(element) {
        fromEvent(element, 'keyup').pipe(
            map((event: any) => event.target.value),
            debounceTime(400),
            distinctUntilChanged(),
        ).subscribe((text: string) => {
            this.query = text;
            this.onSearch.emit(text);
        });
    }
}
