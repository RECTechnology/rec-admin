import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from '../../services/controles/controles.service';
import { UserService } from '../../services/user.service';
import { TablePageBase } from '../../bases/page-base';
import { LoginService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { BussinessDetailsDia } from '../../dialogs/management/bussiness_detailes/bussiness_details.component';
import { ConfirmationMessage } from '../../dialogs/other/confirmation-message/confirmation.dia';
import { TableListHeaderOptions } from '../../components/scaffolding/table-list/tl-header/tl-header.component';
import {
  TlHeader,
  TlItemOption,
  TableListOptions,
} from '../../components/scaffolding/table-list/tl-table/tl-table.component';
import { AdminService } from '../../services/admin/admin.service';
import { ListAccountsParams } from '../../interfaces/search';
import { ExportDialog } from '../../dialogs/other/export-dialog/export.dia';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TlHeaders } from 'src/data/tl-headers';
import { TlItemOptions } from 'src/data/tl-item-options';
import { OrgsExportDefaults } from 'src/data/export-defaults';

const FILTERS = {
  only_offers: 0,
  retailer: 0,
  wholesale: 0,
};

@Component({
  selector: 'organizations',
  styleUrls: ['./organizations.css'],
  templateUrl: './organizations.html',
})
export class OrganizationsComponent extends TablePageBase {
  public pageName = 'Organizations';
  public wholesale = 1;
  public retailer = 1;
  public only_offers = false;

  public showType = 'list';

  public filterChanged = false;
  public filterActive = 3; // 3 is an invalid filter so it will be unselected
  public lang = 'esp';
  public langMap = {
    cat: 'cat',
    en: 'eng',
    es: 'esp',
  };
  public headerOpts: TableListHeaderOptions = {
    input: true,
    refresh: true,
  };
  public headers: TlHeader[] = [
    TlHeaders.Id,
    TlHeaders.AvatarCompany,
    TlHeaders.Phone,
    TlHeaders.Email,
    TlHeaders.OfferCount,
    TlHeaders.onMap(this.openMaps.bind(this)),
    {
      slideAction: this.changeMapVisibility.bind(this),
      sort: 'on_map',
      title: 'Map',
      type: 'slidetoggle',
    },
  ];

  public tableOptions: TableListOptions = {
    optionsType: 'buttons',
    onClick: (entry) => this.viewDetails(entry),
  };

  public itemOptions: TlItemOption[] = [
    TlItemOptions.View(this.viewAccount.bind(this), { text: 'View Account' }),
    TlItemOptions.Edit(this.editDetails.bind(this)),
  ];
  public defaultExportKvp = OrgsExportDefaults;

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public controles: ControlesService,
    public router: Router,
    public us: UserService,
    public ls: LoginService,
    public dialog: MatDialog,
    public as: AdminService,
    public accountsCrud: AccountsCrud,
    public alerts: AlertsService,
  ) {
    super(router);
    this.lang = this.langMap[us.lang];
    // this.search();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {

      this.filterActive = params.filterActive
      this.limit = params.limit ?? 10;
      this.offset = params.offset;
      this.sortDir = params.sortDir;
      this.sortID = params.sortID;
    });
    this.search();
  }

  public ngAfterContentInit() {
    this.setTitle(this.Brand.title + ' | ' + this.pageName);
  }

  public getFilters() {
    switch (Number(this.filterActive)) {
      case 0:
        return {
          ...FILTERS,
          wholesale: 1,
        };
      case 1:
        return {
          ...FILTERS,
          retailer: 1,
        };
      case 2:
        return {
          ...FILTERS,
          only_offers: 1,
        };
      default:
        return FILTERS;
    }
  }

  public search(query: string = this.query) {
    this.loading = true;
    const filters = this.getFilters();
    const data: any = {
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      sort: this.sortID,
      search: query || this.query,
      query: {
        subtype: filters.retailer ? 'RETAILER' : filters.wholesale ? 'WHOLESALE' : '',
        type: 'COMPANY',
        only_with_offers: filters.only_offers,
        search: query || this.query,
      },
    };

    if (!data.subtype) {
      delete data.subtype;
    }

    if (data.query && !data.query.search) {
      delete data.query.search;
    }
    this.query = query;

    this.accountsCrud.search(data).subscribe(
      (resp: any) => {
        this.data = resp.data.elements.map((el) => {
          el.address = [el.street_type, el.street, el.address_number, '-', el.city, el.zip, el.country].join(' ');
          el.coordenates = [el.latitude, el.longitude].join(' ');
          return el;
        });
        this.total = resp.data.total;
        this.sortedData = this.data.slice();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      },
    );
  }

  public confirm(title, message, customBtnText = null, customBtn = true) {
    const ref = this.dialog.open(ConfirmationMessage);
    ref.componentInstance.opts = {
      customBtn,
      customBtnClick: () => {
        ref.componentInstance.close(true);
      },
      customBtnText,
    };

    ref.componentInstance.title = title;
    ref.componentInstance.message = message;
    ref.componentInstance.btnConfirmText = 'Close';
    return ref.afterClosed();
  }

  public changeMapVisibility(acc, visible, i) {
    this.as.setMapVisibility(acc.id, visible.checked).subscribe(
      (resp) => {
        this.alerts.showSnackbar(
          visible.checked ? 'Organization is shown in map' : 'Organization is hidden from map',
          'ok',
        );
      },
      (error) => {
        this.alerts.showSnackbar(error.message, 'ok');
      },
    );
  }

  public getCleanParams(query?: string) {
    const filters = this.getFilters();

    const data: any = {
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      search: query || this.query,
      sort: this.sortID,
      subtype: filters.retailer ? 'RETAILER' : filters.wholesale ? 'WHOLESALE' : '',
      type: 'COMPANY',
      only_offers: filters.only_offers,
    };

    if (!data.type) {
      delete data.type;
    }

    return data;
  }

  public export() {
    const data: ListAccountsParams = this.getCleanParams();

    delete data.offset;
    delete data.limit;

    if (!data.subtype) {
      delete data.subtype;
    }

    return this.alerts.openModal(ExportDialog, {
      defaultExports: [...this.defaultExportKvp],
      entityName: 'Organizations',
      filters: data,
      fn: this.accountsCrud.export.bind(this.accountsCrud),
      list: [...this.defaultExportKvp],
    });
  }

  public viewDetails(bussiness) {
    return this.alerts.openModal(BussinessDetailsDia, { bussiness });
  }

  public editDetails(account) {
    this.router.navigate(['/accounts/edit/' + account.id]);
  }

  public viewAccount(account) {
    this.router.navigate(['/accounts/' + account.id]);
  }

  public openMaps(coord) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coord.latitude},${coord.longitude}`;
    window.open(mapsUrl, '_blank');
  }

  public changedFilter() {
    this.limit = 10;
    this.offset = 0;
    super.addToQueryParams({
      filterActive: this.filterActive,
    });
    this.search(this.query);
  }
}
