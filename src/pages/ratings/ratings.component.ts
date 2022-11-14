import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TablePageBase } from 'src/bases/page-base';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { LoginService } from 'src/services/auth/auth.service';
import { TableListOptions, TlHeader } from '../../components/scaffolding/table-list/tl-table/tl-table.component';
import { TlHeaders } from 'src/data/tl-headers';
import { QualificationsCrud } from '../../services/crud/qualifications/qualifications.crud';
import { TranslateService } from '@ngx-translate/core';
import { ExportDialog } from 'src/dialogs/other/export-dialog/export.dia';
import { QualificationExportDefaults } from '../../data/export-defaults';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
  selector: 'ratings',
  templateUrl: './ratings.html',
  styleUrls: ['./ratings.css'],
})
export class RatingsPage extends TablePageBase {
  public pageName = 'Ratings';
  public headerOpts: TableListHeaderOptions = { input: false, refresh: true, deepLinkQuery: false };
  public filters = { type: 'company' };
  public defaultExportKvp = QualificationExportDefaults;
  @Input() public accountFilter = null;
  @Input() public companyFilter = null;
  @Input() public badgeFilter = null;
  public headers: TlHeader[] = [
    TlHeaders.Id,
    {
      accessor: (v) => (v.reviewer ? v.reviewer : null),
      title: 'Account',
      sortable: false,
      type: 'avatar',
    },
    {
      accessor: (v) => (v.account ? v.account : null),
      title: 'Commerce',
      sortable: false,
      type: 'avatar',
    },
    {
      accessor: 'badge',
      title: 'Attribute',
      sortable: false,
      sort: 'badge',
      type: 'avatar-badges',
    },
    {
      accessor: (v) => (v.value ? 'SI' : 'NO'),
      title: 'Rating',
      sortable: true,
      sort: 'value',
      type: 'text',
    },
    TlHeaders.Created.extend({
      title: 'Date',
      accessor: 'created',
      sort: 'created',
    }),
  ];

  constructor(
    public ls: LoginService,
    public titleService: Title,
    public router: Router,
    public crud: QualificationsCrud,
    public translate: TranslateService,
    public alerts: AlertsService,
  ) {
    super(router, translate);
    this.translate.onLangChange.subscribe(() => {
      this.search();
    });
    this.search();
  }

  public search() {
    this.loading = true;
    this.crud
      .search(
        {
          order: this.sortDir,
          limit: this.limit,
          offset: this.offset,
          sort: this.sortID,
          status: 'reviewed',
          reviewer_id: this.accountFilter ? this.accountFilter.id : null,
          account_id: this.companyFilter ? this.companyFilter.id : null,
          badge_id: this.badgeFilter ? this.badgeFilter.id : null,
        },
        'all',
      )
      .subscribe(
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

  public addAccountIdQuery(event) {
    this.accountFilter = event;
    this.addToQueryParams({
      accountId: event ? event.id : null,
      offset: 0,
    });
    this.offset = 0;
    this.search();
  }

  public addCompanyIdQuery(event) {
    this.companyFilter = event;
    this.addToQueryParams({
      companyId: event ? event.id : null,
      offset: 0,
    });
    this.offset = 0;
    this.search();
  }

  public addBadgeIdQuery(event) {
    this.badgeFilter = event;
    this.addToQueryParams({
      badgeId: event ? event.id : null,
      offset: 0,
    });
    this.offset = 0;
    this.search();
  }

  public export() {
    return this.alerts.openModal(ExportDialog, {
      defaultExports: [...this.defaultExportKvp],
      entityName: 'Qualifications',
      fn: this.crud.export.bind(this.crud),
      list: [...this.defaultExportKvp],
    });
  }
}
