import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ControlesService } from '../../../services/controles/controles.service';
import { Brand } from '../../../environment/brand';
import { environment } from '../../../environment/environment';
import { Router, ActivatedRoute } from '@angular/router';

export interface TableListHeaderOptions {
    input?: boolean;
    newItem?: boolean;
}

const defaultOptions: TableListHeaderOptions = {
    input: true,
    newItem: false,
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

    public ngAfterContentInit() {
        this.route.queryParams
            .subscribe((params) => {
                this.query = params.query;
                if (this.query) {
                    // this.onQuery.emit(this.query);
                    // this.onSearch.emit(this.query);
                }
            });
    }

    public searchChanged() {
        this.queryChange.emit(this.query);
    }

    public search() {
        // this.router.navigate([], { queryParams: { query: this.query }, queryParamsHandling: 'merge' });
        this.queryChange.emit(this.query);
        this.onSearch.emit(this.query);
    }

    public addItem() {
        this.onAdd.emit();
    }
}
