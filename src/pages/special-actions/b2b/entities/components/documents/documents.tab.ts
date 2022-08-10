import { Component, Input } from '@angular/core';
import { EntityTabBase } from '../base.tab';
import { MatDialog } from '@angular/material/dialog';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/services/user.service';
import {
  TlHeader,
  TlItemOption,
  TableListOptions,
} from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { DocumentCrud } from 'src/services/crud/documents/documents';
import { Document } from 'src/shared/entities/document.ent';
import { AddDocumentDia } from 'src/dialogs/entities/add-document/add-document.dia';
import { DocumentKind } from 'src/shared/entities/document_kind.ent';
import { DocumentKindsCrud } from 'src/services/crud/document_kinds/document_kinds';
import { TlHeaders } from 'src/data/tl-headers';
import { TlItemOptions } from 'src/data/tl-item-options';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tab-documents',
  templateUrl: './documents.html',
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
})
export class DocumentTabComponent extends EntityTabBase<Document> {
  public entityName = 'Document';
  public documentKinds: DocumentKind[] = [];
  public STATUS_TYPES = Document.REC_STATUS_TYPES;
  public status;
  public headers: TlHeader[] = [
    TlHeaders.Id,

    {
      accessor: (v) => (v.user ? v.user : {}),
      sortable: false,
      title: 'USER',
      type: 'user-code',
    },
    {
      accessor: (v) => (v.account ? v.account : {}),
      sortable: false,
      title: 'Account',
      type: 'avatar',
    },
    TlHeaders.DocumentKind,

    TlHeaders.Name,
    TlHeaders.StatusCustom((el: any) => ({
      'col-success': el === Document.REC_STATUS_APROVED,
      'col-error': el === Document.REC_STATUS_DECLINED,
      'col-warning': el === Document.REC_STATUS_SUBMITTED || el === Document.REC_STATUS_EXPIRED,
    })),
    TlHeaders.Created.extend({
      title: 'VALID_UNTIL',
      accessor: 'valid_until',
      sort: 'valid_until',
    }),
  ];

  public setType(type) {
    this.status.subtype = type;
  }

  public itemOptions: TlItemOption[] = [
    TlItemOptions.Edit(this.editItem.bind(this)),
    TlItemOptions.Delete(this.deleteItem.bind(this), {
      ngIf: (item) => item.kind && !Object.prototype.hasOwnProperty.call(item.kind, 'lemon_doctype'),
    }),
  ];

  public tableOptions: TableListOptions = {
    optionsType: 'buttons',
    onClick: (element) => {
      window.open(element.content, '_blank');
    },
    getRowClass: (element: Document) => {
      const validUntil = new Date(element.valid_until).getTime();
      const now = Date.now();

      if (validUntil < now) {
        return 'bg-yellow-light';
      }
    },
  };

  public STATUSES = Document.ALL_STATUSES;
  public addComponent = AddDocumentDia;
  public editComponent = AddDocumentDia;

  @Input() public productKindFilter = null;
  @Input() public accountFilter = null;
  @Input() public userFilter = null;
  @Input() public statusFilter = null;
  @Input() public lwStatusFilter = null;
  @Input() public title = 'AVAILABLE_DOCUMENTS'; 

  @Input() public disableAccountFilter = false;
  @Input() public disableUsertFilter = false;
  @Input() public showAccountFilter = true;
  @Input() public showUserFilter = true;
  @Input() public disableStatusFilter = false;
  @Input() public disableDocumentKindFilter = false;

  constructor(
    public crud: DocumentCrud,
    public dialog: MatDialog,
    public alerts: AlertsService,
    public translate: TranslateService,
    public us: UserService,
    public router: Router,
    public dkCrud: DocumentKindsCrud,
    public route: ActivatedRoute,
  ) {
    super(router);
    this.translate.onLangChange.subscribe(() => {
      this.search();
    });
    this.search();
  }

  ngOnInit() {
    this.dkCrud.list({ sort: 'name', dir: 'asc', limit: 100 }).subscribe((resp) => {
      this.documentKinds = resp.data.elements;
    });
    this.getQueryData();
  }

  public getQueryData() {
    
    this.route.queryParams.subscribe((params) => {
      this.limit = params.limit ?? 10;
      this.offset = params.offset;
      this.sortDir = params.sortDir;
      this.sortID = params.sortID;
      this.query = params.query;

      if(this.accountFilter == null){
        this.accountFilter = params.accountId ?? null;
      }
     
      if (this.userFilter == null) {
        this.userFilter = params.userId ?? null;
      }
      this.statusFilter = params.status ?? null;
      
      for (let document of this.documentKinds) {
        
        if (document.id == params.documentKindId && this.productKindFilter == null) {
          this.productKindFilter = document;
        }
      }
    });
    this.search();
  }

  public filterStatus(status) {
    this.statusFilter = status;
    this.lwStatusFilter = null;
    this.addToQueryParams({
      status: status,
      offset: 0
    });
    this.offset = 0;
    this.search();
  }

  public filterLwStatus(status) {
    this.lwStatusFilter = status;
    this.statusFilter = null;
    this.addToQueryParams({
      offset: 0
    });
    this.offset = 0;
    this.search();
  }
  public addUserIdQuery(event) {
    this.userFilter = event;
    this.addToQueryParams({
      userId: event ? event.id : null,
      offset: 0
    });
    this.offset = 0;
    this.search();
  }

  public addAccountIdQuery(event) {
    this.accountFilter = event;
    this.addToQueryParams({
      accountId: event ? event.id : null,
      offset: 0
    });
    this.offset = 0;
    this.search();
  }

  public selectDocKind(doc) {
    this.productKindFilter = doc;
    this.addToQueryParams({
      documentKindId: doc ? doc.id : null,
      offset: 0
    });
    this.offset = 0;
    this.search();
  }



  public editItem(item) {
    super.editItem(item);
  }

  public addItem() {
    super.addItem({
      item: {
        account_id: this.accountFilter ? this.accountFilter.id : null,
        user_id: this.userFilter ? this.userFilter.id : null
      },
      disableAccountSelector: this.disableAccountFilter,
    });
  }

  public search(query?) {
    this.loading = true;
    this.crud
      .search({
        order: this.sortDir,
        limit: this.limit,
        offset: this.offset,
        search: query || this.query || '',
        sort: this.sortID,
        kind: this.productKindFilter ? this.productKindFilter.id : null,
        account: this.accountFilter ? this.accountFilter.id : null,
        user: this.userFilter ? this.userFilter.id : null,
        status: this.statusFilter,

      },'all')
      .subscribe(
        (resp) => {
          this.data = resp.data.elements;
          this.sortedData = this.data.slice();
          this.total = resp.data.total;
          this.loading = false;

        },
        (error) => {
          this.loading = false;
          this.alerts.observableErrorSnackbar(error);
        },
      );

  }
}
