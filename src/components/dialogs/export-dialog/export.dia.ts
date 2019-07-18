import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ExportFilters } from '../../../interfaces/export';
import { Observable } from 'rxjs';

@Component({
  selector: 'export-dialog',
  templateUrl: './export.dia.html',
})
export class ExportDialog implements OnInit {
  public entityName: string = 'Export';
  public filters: any = {};
  public list: any = [];
  public defaultExports: any = [];
  public fileName: string = '';
  public error: string = '';
  public hidden = true;
  public fn: ((v?: any) => Observable<any>) = () => new Observable();

  // tslint:disable-next-line: member-ordering
  private csvData: string = null;

  // tslint:disable-next-line: member-ordering
  private loading = false;

  // tslint:disable-next-line: member-ordering
  constructor(
    public dialogRef: MatDialogRef<ExportDialog>,
  ) {
  }

  public reset() {
    this.list = [...this.defaultExports];
  }

  public ngOnInit() {
    this.fileName = [
      'export',
      '-',
      (this.entityName),
      '-',
      (new Date().toLocaleString().replace(/\s/g, '-')),
      '.csv',
    ].join('').toLowerCase();
  }

  public changedItems($event) {
    console.log('Chagned');
  }

  public getFieldMap() {
    const map = {};
    console.log(this.list);
    for (const entry of this.list) {
      if (entry && entry.active && entry.key) {
        map[entry.key] = entry.value;
      }
    }
    return map;
  }

  public export() {
    this.hidden = true;
    const field_map = this.getFieldMap();
    console.log('Field map', field_map);
    this.loading = true;
    this.fn({ ...this.filters, field_map }).subscribe((resp) => {
      console.log(resp);
      this.loading = false;
      // this.csvData = resp;
      this.download(resp, 'text/csv', this.fileName);
    }, (error) => {
      this.error = error._body.message || 'Error';
      this.loading = false;
    });
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
    this.close();
  }

  public close(confirmed = false): void {
    this.dialogRef.close(confirmed);
  }
}
