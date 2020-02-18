import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  public errorLarge: string = '';
  public showAllError = false;
  public hidden = true;
  public fn: ((v?: any) => Observable<any>) = () => new Observable();

  // tslint:disable-next-line: member-ordering
  public csvData: string = null;

  // tslint:disable-next-line: member-ordering
  public loading = false;

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
  }

  public getFieldMap() {
    const map = {};
    for (const entry of this.list) {
      if (entry && entry.active && entry.key) {
        map[entry.key] = entry.value;
      }
    }
    return map;
  }

  public export() {
    this.hidden = true;
    this.error = null;

    const field_map = this.getFieldMap();

    this.loading = true;
    this.fn({ ...this.filters, field_map }).subscribe((resp) => {
      this.loading = false;
      this.download(resp, 'text/csv', this.fileName);
    }, (error) => {
      this.errorLarge = (error.message || 'Error');
      this.error = this.errorLarge.substr(0, 86);
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
