import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from '../../services/controles/controles.service';
import { UserService } from '../../services/user.service';
import { PageBase } from '../../bases/page-base';
import { LoginService } from '../../services/auth.service';
import { MatDialog, Sort } from '../../../node_modules/@angular/material';
import { BussinessDetailsDia } from '../dialogs/bussiness_detailes/bussiness_details.component';
import { EditAccountData } from '../dialogs/edit-account/edit-account.dia';
import { ConfirmationMessage } from '../../components/dialogs/confirmation-message/confirmation.dia';
import { MySnackBarSevice } from '../../bases/snackbar-base';
import { TableListHeaderOptions } from '../../components/table-list/tl-header/tl-header.component';
import { TlHeader, TlItemOption } from '../../components/table-list/tl-table/tl-table.component';
import { AdminService } from '../../services/admin/admin.service';
import { ListAccountsParams, SearchAccountsParams } from '../../interfaces/search';
import { ExportDialog } from '../../components/dialogs/export-dialog/export.dia';

const FILTERS = {
  only_offers: 0,
  retailer: 0,
  wholesale: 0,
};

@Component({
  selector: 'bussiness',
  styleUrls: [
    '../../pages/bussiness/bussiness.css',
  ],
  templateUrl: '../../pages/bussiness/bussiness.html',
})
export class BussinessComponent extends PageBase {
  public pageName = 'Bussiness';
  public totalBussiness = 0;
  public limit = 10;
  public showing = 0;
  public sortedData = [];
  public bussinessList = [];
  public wholesale = 1;
  public retailer = 1;
  public only_offers = false;

  public filterChanged = false;
  public filterActive = 3; // 3 is an invalid filter so it will be unselected

  public sortID: string = 'id';
  public sortDir: string = 'desc';

  public query: string = '';

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

  public itemOptions: TlItemOption[] = [{
    callback: this.viewDetails.bind(this),
    icon: 'eye',
    text: 'View',
  }, {
    callback: this.editDetails.bind(this),
    icon: 'edit',
    text: 'Edit User',
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
    public snackbar: MySnackBarSevice,
  ) {
    super();
    this.lang = this.langMap[us.lang];
    this.getBussiness();
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

  public getBussiness(query: string = '') {
    this.loading = true;
    const filters = this.getFilters();
    const data: any = {
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      sort: this.sortID,
      // tslint:disable-next-line: object-literal-sort-keys
      query: {
        only_with_offers: filters.only_offers,
        search: query || this.query,
        subtype: filters.retailer ? 'RETAILER' : filters.wholesale ? 'WHOLESALE' : '',
        type: 'COMPANY',
      },
    };

    if (data.query && !data.query.subtype) {
      delete data.query.subtype;
    }

    if (data.query && !data.query.search) {
      delete data.query.search;
    }

    // const data = this.getCleanParams();
    // // data.on_map = 1;
    // if (!data.subtype) {
    //   delete data.subtype;
    // }
    // if (data.subtype && !data.subtype.search) {
    //   delete data.subtype.search;
    // }

    this.as.listAccountsV3(data).subscribe(
      (resp) => {
        this.bussinessList = resp.data.elements.map((el) => {
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
        this.totalBussiness = resp.data.total;
        this.sortedData = this.bussinessList.slice();
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
          this.snackbar.open(visible.checked
            ? 'Organization is shown in map'
            : 'Organization is hidden from map', 'ok',
          );
        },
        (error) => {
          this.snackbar.open(error._body.message, 'ok');
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

    const dialogRef = this.dialog.open(ExportDialog);
    dialogRef.componentInstance.filters = data;
    dialogRef.componentInstance.fn = this.as.exportAccountsV3.bind(this.as);
    dialogRef.componentInstance.entityName = 'Organizations';
    dialogRef.componentInstance.defaultExports = [...this.defaultExportKvp];
    dialogRef.componentInstance.list = [...this.defaultExportKvp];

    return dialogRef.afterClosed();
  }

  public search(query: string = '') {
    this.filterChanged = true;
    this.getBussiness(query);
  }

  public sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.sortedData = this.bussinessList.slice();
      this.sortID = 'id';
      this.sortDir = 'desc';
    } else {
      this.sortID = sort.active;
      this.sortDir = sort.direction.toUpperCase();
    }

    this.search();
  }

  public viewDetails(bussiness) {
    const ref = this.dialog.open(BussinessDetailsDia);
    ref.componentInstance.bussiness = bussiness;
  }

  public editDetails(bussiness) {
    const dialogRef = this.dialog.open(EditAccountData);
    dialogRef.componentInstance.account = Object.assign({}, bussiness);

    dialogRef.afterClosed()
      .subscribe((result) => {
        this.search();
      });
  }

  public openMaps(coord) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coord.latitude},${coord.longitude}`;
    window.open(mapsUrl, '_blank');
  }

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = this.limit * ($event.pageIndex);
    this.search();
  }

  public changedFilter() {
    this.limit = 10;
    this.offset = 0;
    this.search();
  }
}
