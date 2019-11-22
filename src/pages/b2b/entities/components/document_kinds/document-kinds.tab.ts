import { Component } from '@angular/core';
import { EntityTabBase } from '../base.tab';
import { MatDialog, MatSort } from '@angular/material';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/services/user.service';
import { DocumentKind } from 'src/shared/entities/document_kind.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import {
    TlHeader, TlItemOption, TableListOptions,
} from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { AddDocumentKindDia } from 'src/dialogs/entities/add-document-kind/add-document-kind.dia';

@Component({
    selector: 'tab-document-kinds',
    templateUrl: './document-kinds.html',
})
export class DocumentKindsTabComponent extends EntityTabBase<DocumentKind> {
    public documentKinds: DocumentKind[] = [];
    public headerOpts: TableListHeaderOptions = { input: true, refresh: true };
    public headers: TlHeader[] = [
        {
            sort: 'id',
            title: 'ID',
            type: 'code',
            accessor: 'id',
        },
        {
            sort: 'name',
            title: 'Name',
            accessor: 'name',
        },
        {
            sort: 'description',
            title: 'Description',
            accessor: 'description',
        },
    ];
    public itemOptions: TlItemOption[] = [{
        callback: this.editItem.bind(this),
        icon: 'fa-edit',
        text: 'Edit',
    }, {
        callback: this.deleteItem.bind(this),
        icon: 'fa-trash',
        class: 'col-error',
        text: 'Delete',
    }];
    public tableOptions: TableListOptions = {
        optionsType: 'menu',
    };
    public addComponent = AddDocumentKindDia;
    public editComponent = AddDocumentKindDia;
    public entityName = 'Document Kind';

    constructor(
        public crud: DocumentKindsCrud,
        public dialog: MatDialog,
        public alerts: AlertsService,
        public translate: TranslateService,
        public us: UserService,
    ) {
        super();
        this.translate.onLangChange.subscribe(() => {
            this.search();
        });
    }

    public sortData(sort: MatSort) {
        super.sortData(sort);
    }

    public search(query?) {
        this.loading = true;
        this.crud.search({
            order: this.sortDir,
            limit: this.limit,
            offset: this.offset,
            search: query || this.query || '',
            sort: this.sortID,
        }, 'all').subscribe(
            (resp) => {
                this.data = resp.data.elements;
                this.sortedData = this.data.slice();
                this.total = resp.data.total;
                this.loading = false;
            },
            (error) => {
                this.loading = false;
            },
        );
    }
}