import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CurrenciesService } from '../../../../services/currencies/currencies.service';
import { UserService } from '../../../../services/user.service';
import BaseDialog from '../../../../bases/dialog-base';
import { Parser } from 'json2csv';
import { AdminService } from '../../../../services/admin/admin.service';
import { ListAccountsParams } from '../../../../interfaces/search';

@Component({
  selector: 'export-sellers',
  templateUrl: './export-sellers.html',
})
export class ExportExchangersDia extends BaseDialog {
  public data: any[];
  public exportTypes = ['csv', 'json'];
  public exportType = 'csv';
  public fileName = 'system-exchangers';

  public sortID: string = 'id';
  public sortDir: string = 'desc';

  public foundExchangers = 0;

  public offset = 0;
  public limit = 3500;
  public type = '';
  public query = '';

  public exportFields = [
    'id', 'name', 'roles', 'type', 'subtype', 'email', 'phone', 'country',
    'city', 'street', 'street_type', 'address_number', 'zip', 'cif', 'tier',
  ];

  private preview = '';

  constructor(
    public currencies: CurrenciesService,
    public dialogRef: MatDialogRef<ExportExchangersDia>,
    private us: UserService,
    public as: AdminService,
  ) {
    super();
  }

  public getExchangers(): void {
    const data: ListAccountsParams = {
      active: 1,
      limit: this.limit,
      offset: this.offset,
      order: this.sortDir,
      sort: this.sortID,
      tier: 2,
      type: 'COMPANY',
    };

    if (!data.type) {
      delete data.type;
    }

    this.loading = true;
    this.as.listAccountsV3(data).subscribe(
      (resp) => {
        this.data = resp.elements;
        this.foundExchangers = this.data.length;
        this.loading = false;
        this.preview = this.getFormatted(this.data);
      });
  }

  public getFormatted(data) {
    const filtered = [];
    for (const entry of data) {
      const clean = {};
      for (const key in entry) {
        if (this.exportFields.indexOf(key) !== -1) {
          clean[key] = entry[key];
        }
      }
      filtered.push(clean);
    }

    if (this.exportType === 'csv') {
      return this.convertToCSV(filtered);
    }
    if (this.exportType === 'json') {
      return JSON.stringify(filtered, null, 4);
    }
  }

  public export(type) {
    const name = this.fileName || 'test-csv';
    const data = this.data.sort(
      (a: any, b: any) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      },
    );

    const date = new Date().toLocaleDateString();
    const formatted = this.getFormatted(data);
    const ctype = type === 'csv' ? 'text/csv' : 'application/json';
    const ext = '.' + type;
    this.download(formatted, ctype, name + `-${date}${ext}`);
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
    const json2csvParser = new Parser({ fields: this.exportFields, quote: '' });
    const csv = json2csvParser.parse(objArray);
    return csv;
  }

  public close(): void {
    this.dialogRef.close();
  }
}
