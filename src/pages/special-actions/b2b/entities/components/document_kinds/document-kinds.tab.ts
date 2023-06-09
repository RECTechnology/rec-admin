import { Component } from '@angular/core';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material/dialog';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/services/user.service';
import { DocumentKind } from 'src/shared/entities/document_kind.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { TlHeader } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { AddDocumentKindDia } from 'src/dialogs/entities/add-document-kind/add-document-kind.dia';
import { TlHeaders } from 'src/data/tl-headers';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'tab-document-kinds',
    templateUrl: './document-kinds.html',
})
export class DocumentKindsTabComponent extends EntityTabBase<DocumentKind> {
    public headers: TlHeader[] = [
        TlHeaders.Id,
        TlHeaders.Name,
        TlHeaders.generate('isLemonway', {
            title: 'Lemonway Doc',
            accessor(item: DocumentKind) {
                return Object.prototype.hasOwnProperty.call(item, 'lemon_doctype');
            },
            type: 'checkbox',
            sortable: false,
        }),
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
        public router: Router,
        public route: ActivatedRoute,

    ) {
        super(router);
        this.translate.onLangChange.subscribe(() => {
            this.search();
        });
    }
    ngOnInit(){
        this.route.queryParams.subscribe((params) => {

         
            this.limit = params.limit ?? 10;
            this.offset = params.offset;
            this.sortDir = params.sortDir;
            this.sortID = params.sortID;
            this.query = params.query;
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
