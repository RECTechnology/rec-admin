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
import { TlHeaders } from 'src/data/tl-headers';
import { TlItemOptions } from 'src/data/tl-item-options';

@Component({
    selector: 'tab-document-kinds',
    templateUrl: './document-kinds.html',
})
export class DocumentKindsTabComponent extends EntityTabBase<DocumentKind> {
    public headers: TlHeader[] = [
        TlHeaders.Id,
        TlHeaders.Name,
        TlHeaders.Description,
        TlHeaders.Updated,
    ];

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
