import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { WalletService } from '../../../services/wallet/wallet.service';
import { TransactionService } from '../../../services/transactions/transactions.service';
import { TxFilter } from '../../../components/other/filter/filter';
import { CompanyService } from '../../../services/company/company.service';

import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CampaignUsersCrud } from 'src/services/crud/user_campaigns/user-campaigns.crud';

@Component({
  selector: 'export-campaigns-users',
  templateUrl: './export-campaigns.dia.html',
})
export class ExportCampaignsUsers extends BaseDialog {
  public data: any[];
  public dateFrom: Date | any = null;
  public dateTo: Date | any = null;
  public foundUsers = null;
  public filter: TxFilter;
  public exportTypes = ['csv', 'json'];
  public exportType = 'csv';
  public fileName = 'campaign-users';
  public getCampaignUsersSubscription: Subscription;
  public campaign_id: number = null;

  public sortID: string = 'id';
  public sortDir: string = 'desc';

  public offset = 0;
  public limit = 3500;

  public preview = '';

  constructor(
    public dialogRef: MatDialogRef<ExportCampaignsUsers>,
    public us: UserService,
    public cs: CompanyService,
    public ws: WalletService,
    public txService: TransactionService,
    public campaignUsersCrud: CampaignUsersCrud
  ) {
    super();
  }

  public getCampaignsUsers(): void {
    this.loading = true;

    this.getCampaignUsersSubscription = this.campaignUsersCrud.getCampaignUsers(this.campaign_id)
      .subscribe(resp => {
        this.data =  resp.data.elements;
        this.foundUsers = this.data.length;
        this.loading = false;
        this.preview = this.getFormatted(this.data);

      }, (error) => {
        this.loading = false;
        this.error = error.message;
      })
  }

  public getFormatted(data) {
    if (this.exportType === 'csv') {
      return this.convertToCSV(data);
    }
    if (this.exportType === 'json') {
      return JSON.stringify(data, null, 4);
    }
  }

  public export(type) {
    const name = this.fileName || 'test-csv';
    const data = this.data.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const formatted = this.getFormatted(data);
    const ctype = type === 'csv' ? 'text/csv' : 'application/json';
    const ext = '.' + type;

    this.download(formatted, ctype, name + `-${this.dateFrom}-${this.dateTo}${ext}`);
  }

  public download(data, mimeType, fileName) {
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
  }

  public convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';

    for (const index in objArray[0]) {
      if (index) {
        row += index.toUpperCase() + ',';
      }
    }
    row = row.slice(0, -1);
    // append Label row with line break
    str += row + '\r\n';

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index in array[i]) {
        if (index) {
          if (line !== '' && line !== '[object Object]') {
            line += ',';
          }
          const data = array[i][index];
          line += data;
        }
      }
      str += line + '\r\n';
    }
    return str;
  }

  public close(): void {
    this.dialogRef.close();
  }
}