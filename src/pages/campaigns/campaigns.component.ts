import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TablePageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { MatDialog } from '@angular/material/dialog';
import { AddCampaignDia } from 'src/dialogs/campaigns/add-campaign.dia';
import { CampaignsCrud } from '../../services/crud/campaigns/campaigns.service';
import {
  TableListOptions,
  TlHeader,
  TlItemOption,
} from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TlHeaders } from 'src/data/tl-headers';
import { TlItemOptions } from 'src/data/tl-item-options';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'campaigns',
  templateUrl: './campaigns.html',
  styleUrls: ['./campaigns.css'],
})
export class CampaignsPage extends TablePageBase {
  public pageName = 'CAMPAIGNS';
  public campaignData: {};
  public timeout: any;
  public statuses: any[] = [
    { label: 'Active', value: 'active' },
    { label: 'CREATED_F', value: 'created' },
    { label: 'Finished', value: 'finished' },
  ];
  public selectedStatuses = new FormControl([]);
  public headerOpts: TableListHeaderOptions = { input: false, refresh: true, deepLinkQuery: false };
  public tableOptions: TableListOptions = {
    optionsType: 'buttons',
    onClick: (entry) => this.viewCampaign(entry),
  };
  public itemOptions: TlItemOption[] = [
    TlItemOptions.Edit(this.editItem.bind(this)),
    TlItemOptions.Delete(this.deleteItem.bind(this)),
  ];

  public headers: TlHeader[] = [
    TlHeaders.Id,
    {
      title: 'Name',
      accessor: (el) => (el.name != '' ? el.name : 'Campaña'),
      sortable: true,
      sort: 'name',
    },
    {
      title: 'Admin',
      accessor: 'campaign_account',
      sortable: false,
      sort: 'campaign_account',
      type: 'account_id',
    },
    {
      title: 'BONIFICATION',
      accessor: 'redeemable_percentage',
      suffix: '%',
      sortable: false,
      sort: 'redeemable_percentage',
    },
    {
      title: 'MIN_RECHARGE',
      sortable: true,
      accessor: (el) => (el.version != 0 ? el.min / 1e8 : el.min),
      suffix: 'R',
      sort: 'min',
    },
    {
      title: 'MAX_RECHARGE',
      sortable: true,
      accessor: (el) => (el.version != 0 ? el.max / 1e8 : el.max),
      suffix: 'R',
      sort: 'max',
    },
    {
      title: 'Status',
      data: ['status'],
      sort: 'end_date',
      sortable: false,
      tooltip: (entry) => `Inicio: ${this.formatDate(entry.init_date)}  / Fin: ${this.formatDate(entry.end_date)}`,
      type: 'status-with-time',
    },
    {
      title: 'STATUS_CAMPAIGN_DETAILS',
      sort: 'bonus_enabled',
      sortable: false,
      data: ['status', 'bonus_enabled', 'ending_alert'],
      type: 'status-campaigns-details',
    },
  ];
  constructor(
    public ls: LoginService,
    public titleService: Title,
    public router: Router,
    public dialog: MatDialog,
    public crud: CampaignsCrud,
    public translate: TranslateService,
    public alerts: AlertsService,
  ) {
    super(router, translate);
    this.translate.onLangChange.subscribe(() => {});
    this.search();
  }

  public search(query?: string, statuses?: any[]) {
    this.loading = true;

    this.crud
      .search(
        {
          order: this.sortDir,
          limit: this.limit,
          offset: this.offset,
          sort: 'end_date',
          statuses,
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
          this.validationErrors = error.errors;
          this.loading = false;
        },
      );
  }

  public searchByFilters($event) {
    if ($event.value.length > 0) {
      this.search('', this.formatStatuses($event.value));
      console.log();
    } else {
      this.search();
    }
  }

  public addItem() {
    const dialogRef = this.dialog.open(AddCampaignDia, { disableClose: true });
    dialogRef.afterClosed().subscribe((created) => {
      this.search();
    });
  }

  public deleteItem(item: any) {
    if (this.loading) {
      return;
    }
    if (item.version === 0) {
      this.alerts.showSnackbar('CANNOT_DELETE_V1_CAMPAIGN');
      return;
    }

    this.alerts.confirmDeletion('campaign', `(${item.name || ''})`, true).subscribe((confirm) => {
      if (!confirm) {
        this.loading = false;
        return;
      }

      this.loading = true;
      this.crud.remove(item.id).subscribe(
        (resp) => {
          this.alerts.showSnackbar('REMOVED_CAMPAIGN_SUCCESSFULLY', 'OK');
          this.search();
        },
        (err) => {
          this.alerts.showSnackbar(err.message, 'ok');
          this.loading = false;
        },
      );
    });
  }

  public editItem(campaign) {
    const dialogRef = this.dialog.open(AddCampaignDia, { disableClose: true });
    dialogRef.componentInstance.isEdit = true;
    dialogRef.componentInstance.campaignId = campaign.id;
    dialogRef.componentInstance.version = campaign.version;
    dialogRef.componentInstance.pageArrays = [
      this.getCampaignDataToEdit(campaign, ['name', 'url_tos', 'init_date', 'end_date', 'redeemable_percentage']),
      this.getCampaignDataToEdit(campaign, ['min', 'max', 'campaign_account']),
      this.getCampaignDataToEdit(campaign, ['image_url', 'promo_url', 'video_promo_url']),
      this.getCampaignDataToEdit(campaign, ['bonus_ending_threshold']),
    ];
    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.search();
      }
    });
  }

  public formatDate(date?: Date) {
    let dateNow = new Date();
    let dateSupport = new Date(date);
    let datepipe: DatePipe = new DatePipe('es');

    return date
      ? datepipe.transform(dateSupport, 'yyyy-MM-ddTHH:mm:ss')
      : datepipe.transform(dateNow, 'yyyy-MM-ddTHH:mm:ss');
  }

  public formatStatuses(statuses: any) {
    let formattedData: any[] = [];
    let response: any[] = [];
    if (statuses.length) {
      statuses.map((status, index) => {
        if (status) {
          formattedData.push(status.value);
        }
      });
      response = formattedData;
    }
    return response;
  }

  public getCampaignDataToEdit(campaign, data: string[]) {
    return Object.keys(campaign).reduce(function (result, key) {
      data.map((copyKey) => {
        if (key && data.includes(key)) {
          result[key] = campaign[key];
        }
        if (!Object.keys(campaign).includes(copyKey)) {
          result[copyKey] = '';
        }
      });
      return result;
    }, {});
  }

  public viewCampaign(campaign) {
    if (campaign.version === 0) {
      this.alerts.showSnackbar('CANNOT_SHOW_CAMPAIG_INFO');
      return;
    }
    this.router.navigate([`/campaigns/${campaign.id}`]);
  }
}
