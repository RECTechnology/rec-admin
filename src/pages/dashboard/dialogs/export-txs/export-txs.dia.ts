import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../../../../services/user.service';
import BaseDialog from '../../../../bases/dialog-base';
import { TransactionService } from '../../../../services/transactions/transactions.service';
import { TxFilter } from '../../../../components/other/filter/filter';

@Component({
  selector: 'export-txs',
  templateUrl: './export-txs.html',
})
export class ExportTxsDia extends BaseDialog {
  public data: any = {};
  public dateFrom: Date | any = null;
  public dateTo: Date | any = null;
  public foundTxs = null;
  public filter: TxFilter;
  public exportTypes = ['csv', 'json'];
  public exportType = 'csv';
  public fileName = 'wallet-transactions';

  constructor(
    public dialogRef: MatDialogRef<ExportTxsDia>,
    public us: UserService,
    public txService: TransactionService,
  ) {
    super();
    this.filter = new TxFilter();
    this.filter.reloader = this.getTransactions.bind(this);
    this.filter.filterOptions.status = this.filter.statuses;
  }

  public changedDate(dn, $event) {
    const d = $event.target.value;
    if (dn === 'from') { this.dateFrom = d; }
    if (dn === 'to') { this.dateTo = d; }
    this.filter.filterModified = true;
    this.filter.reloader();
  }

  public export(type) {
    const name = this.fileName || 'test-csv';
    const data = this.data.elements.map((el) => {
      return {
        amount: el.unitsScaled,
        created: el.created,
        currency: el.currency,
        id: el.id,
        method: el.method,
        price: el.actual_price,
        price_currency: el.scales.from,
        status: el.status,
        total: el.actual_price * el.unitsScaled,
        type: el.type,
        updated: el.updated,
      };
    }).sort(
      (a, b) => {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      },
    );

    if (type === 'csv') {
      this.download(this.convertToCSV(data), 'text/csv', name + `-${this.dateFrom}-${this.dateTo}.csv`);
    }
    if (type === 'json') {
      this.download(JSON.stringify(data, null, 4), 'application/json', name + `-${this.dateFrom}-${this.dateTo}.json`);
    }
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
        // Now convert each value to string and comma-separated
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
          if (line !== '') { line += ','; }
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

  public getTransactions(): void {
    this.loading = true;
    const filterData = this.filter.getFilterData(0, 100000, this.dateFrom, this.dateTo);

    this.txService.getChartTransactions(this.us.getGroupId(), filterData)
      .subscribe((resp) => {
        this.data = resp.data;
        this.foundTxs = resp.data.total;
        this.loading = false;
      });
  }
}
