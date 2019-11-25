import { Component } from '@angular/core';
import { EntityTabBase } from '../base.tab';
import { MatDialog, MatSort } from '@angular/material';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/services/user.service';
import {
    TlHeader, TlItemOption, TableListOptions,
} from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { DocumentCrud } from 'src/services/crud/documents/documents';
import { Document } from 'src/shared/entities/document.ent';
import { AddDocumentDia } from 'src/dialogs/entities/add-document/add-document.dia';
import { DocumentKind } from 'src/shared/entities/document_kind.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { TlHeaders } from 'src/data/tl-headers';
import { TlItemOptions } from 'src/data/tl-item-options';

@Component({
    selector: 'tab-documents',
    templateUrl: './documents.html',
})
export class DocumentTabComponent extends EntityTabBase<Document> {
    public entityName = 'Document';
    public documentKinds: DocumentKind[] = [];
    public headers: TlHeader[] = [
        TlHeaders.Id,
        {
            accessor: (v) => v.account,
            sortable: false,
            title: 'Name',
            type: 'avatar',
        },
        TlHeaders.DocumentKind,
        TlHeaders.Name,
        TlHeaders.Status,
        TlHeaders.Description,
    ];

    public STATUSES = Document.ALL_STATUSES;
    public addComponent = AddDocumentDia;
    public editComponent = AddDocumentDia;

    public productKindFilter = null;
    public accountFilter = null;
    public statusFilter = null;

    constructor(
        public crud: DocumentCrud,
        public dialog: MatDialog,
        public alerts: AlertsService,
        public translate: TranslateService,
        public us: UserService,
        public dkCrud: DocumentKindsCrud,
    ) {
        super();
        this.translate.onLangChange.subscribe(() => {
            this.search();
        });

        this.dkCrud.list({ sort: 'name', dir: 'asc', limit: 100 })
            .subscribe((resp) => {
                this.documentKinds = resp.data.elements;
            });
    }

    public filterStatus(status) {
        this.statusFilter = status;
        this.search();
    }

    public selectDocKind(doc) {
        this.productKindFilter = doc;
        this.search();
    }

    public search(query?) {
        this.loading = true;
        this.crud.search({
            order: this.sortDir,
            limit: this.limit,
            offset: this.offset,
            search: query || this.query || '',
            sort: this.sortID,
            kind: this.productKindFilter ? this.productKindFilter.id : null,
            account: this.accountFilter,
        }).subscribe(
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
