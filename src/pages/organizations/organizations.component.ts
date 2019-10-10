import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from '../../services/controles/controles.service';
import { UserService } from '../../services/user.service';
import { TablePageBase } from '../../bases/page-base';
import { LoginService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material';
import { BussinessDetailsDia } from '../dialogs/bussiness_detailes/bussiness_details.component';
import { EditAccountData } from '../dialogs/edit-account/edit-account.dia';
import { ConfirmationMessage } from '../../components/dialogs/confirmation-message/confirmation.dia';
import { TableListHeaderOptions } from '../../components/table-list/tl-header/tl-header.component';
import { TlHeader, TlItemOption } from '../../components/table-list/tl-table/tl-table.component';
import { AdminService } from '../../services/admin/admin.service';
import { ListAccountsParams } from '../../interfaces/search';
import { ExportDialog } from '../../components/dialogs/export-dialog/export.dia';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';

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
  };
  public headers: TlHeader[] = [
    {
      sort: 'id',
      title: 'ID',
    }, {
      avatar: {
        sort: 'company_image',
        title: 'Company Image',
      },
      sort: 'name',
      title: 'Name',
      type: 'avatar',
    }, {
      accessor: (el) => '+' + (el.prefix || '--') + ' ' + el.phone,
      sort: 'phone',
      title: 'Phone',
    }, {
      sort: 'email',
      title: 'Email',
    }, {
      accessor: (el: any) => {
        return el.category ? el.category[this.lang] : '...';
      },
      sort: 'category',
      title: 'Category',
    }, {
      accessor: (el: any) => {
        return el.offer_count;
      },
      avatar: {
        accessor: () => '/assets/resources/offerta-small.png',
        sort: 'offer',
        title: 'offer',
      },
      sort: 'offer_count',
      sortable: false,
      title: 'Offers',
      type: 'avatar',
    }, {
      buttonAction: this.openMaps.bind(this),
      buttonImg: '/assets/resources/marcador.png',
      sort: 'coordenates',
      sortable: false,
      title: 'Coordenates',
      type: 'button',
    }, {
      slideAction: this.changeMapVisibility.bind(this),
      sort: 'on_map',
      title: 'Map',
      type: 'slidetoggle',
    }];
  public itemOptions: TlItemOption[] = [
    {
      callback: this.viewDetails.bind(this),
      icon: 'eye',
      text: 'View',
    }, {
      callback: this.editDetails.bind(this),
      icon: 'edit',
      text: 'Edit',
    }];
  public defaultExportKvp = [
    { key: 'id', value: '$.id', active: true },
    { key: 'name', value: '$.name', active: true },
    { key: 'cif', value: '$.cif', active: true },
    { key: 'type', value: '$.type', active: true },
    { key: 'subtype', value: '$.subtype', active: true },
    { key: 'street_type', value: '$.street_type', active: true },
    { key: 'street', value: '$.street', active: true },
    { key: 'address_number', value: '$.address_number', active: true },
    { key: 'dni', value: '$.kyc_manager.dni', active: true },
    { key: 'phone', value: '$.phone', active: true },
  ];

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
    super();
    this.lang = this.langMap[us.lang];
    this.search();
  }

  public ngAfterContentInit() {
    this.setTitle(this.Brand.title + ' | ' + this.pageName);
  }

  public getFilters() {
    switch (Number(this.filterActive)) {
      case (0): return {
        ...FILTERS,
        wholesale: 1,
      };
      case (1): return {
        ...FILTERS,
        retailer: 1,
      };
      case (2): return {
        ...FILTERS,
        only_offers: 1,
      };
      default: return FILTERS;
    }
  }

  public search(query: string = '') {
    this.loading = true;
    const filters = this.getFilters();
    const data: any = {
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      sort: this.sortID,
      subtype: filters.retailer ? 'RETAILER' : filters.wholesale ? 'WHOLESALE' : '',
      type: 'COMPANY',
      only_with_offers: filters.only_offers,
      search: query || this.query,
    };

    if (!data.subtype) {
      delete data.subtype;
    }

    if (data.query && !data.query.search) {
      delete data.query.search;
    }

    this.accountsCrud.search(data).subscribe(
      (resp: any) => {
        this.data = resp.data.elements.map((el) => {
          el.address = [
            el.street_type,
            el.street,
            el.address_number,
            '-',
            el.city,
            el.zip,
            el.country,
          ].join(' ');

          el.coordenates = [
            el.latitude,
            el.longitude,
          ].join(' ');
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
    this.as.setMapVisibility(acc.id, visible.checked)
      .subscribe(
        (resp) => {
          this.alerts.showSnackbar(visible.checked
            ? 'Organization is shown in map'
            : 'Organization is hidden from map', 'ok',
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
      // tslint:disable-next-line: object-literal-sort-keys
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

  public editDetails(bussiness) {
    this.alerts.openModal(EditAccountData, {
      account: Object.assign({}, bussiness),
    }).subscribe((result) => {
      this.search();
    });
  }

  public openMaps(coord) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coord.latitude},${coord.longitude}`;
    window.open(mapsUrl, '_blank');
  }

  public changedFilter() {
    this.limit = 10;
    this.offset = 0;
    this.search();
  }
}
