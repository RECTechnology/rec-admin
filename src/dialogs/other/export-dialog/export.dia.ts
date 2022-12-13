import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UserService } from 'src/services/user.service';
import { ExportSentDialog } from '../export-sent-dialog/export-sent.dia';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'export-dialog',
  templateUrl: './export.dia.html',
})
export class ExportDialog implements OnInit {
  public entityName: string = 'Export';
  public filters: any = {};
  public list: any = [];
  public disabledLimitFiled: boolean = true;
  public defaultExports: any = [];
  public error: string = '';
  public errorLarge: string = '';
  public qbitMail: string = 'inbox@rec.qbitartifacts.com'
  public showAllError = false;
  public hidden = true;
  public formGroup = new FormGroup({
    email: new FormControl(null, Validators.required),
    fileName: new FormControl({}),
    limit: new FormControl({value: null, disabled: this.disabledLimitFiled}),
    all: new FormControl({value: true}),
  });

  public fn: (v?: any) => Observable<any> = () => new Observable();

  // tslint:disable-next-line: member-ordering
  public csvData: string = null;

  // tslint:disable-next-line: member-ordering
  public loading = false;

  // tslint:disable-next-line: member-ordering
  constructor(
    public dialogRef: MatDialogRef<ExportDialog>,
    public alerts: AlertsService,
    public us: UserService) {}

  public reset() {
    this.list = [...this.defaultExports];
  }

  public ngOnInit() {
    
    this.setDefaultMail();
    
    const fileName = ['export', '-', this.entityName, '-', new Date().toLocaleString().replace(/\s/g, '-'), '.csv']
      .join('')
      .toLowerCase();
    this.formGroup.get('fileName').setValue(fileName);
  }

  public changedItems($event) {
    //
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
    if(this.formGroup.get('all').value){
      this.filters.limit = 100000;
    }else {
      this.filters.limit = this.formGroup.get('limit').value;
    }

    const field_map = this.getFieldMap();

    this.loading = true;
    this.fn({ filters: this.filters, field_map, email: this.formGroup.get('email').value }).subscribe(
      (resp) => {
        this.loading = false;
        this.close();
        this.showConfirmation();
      },
      (error) => {
        this.errorLarge = error.message || 'Error';
        this.error = this.errorLarge.substr(0, 86);
        this.loading = false;
      },
    );
  }

  public setDefaultMail() {
    if(!window.location.href.includes('admin.rec.barcelona')) {
      this.formGroup.get('email').setValue(this.qbitMail);
    } else {
      if(this.us.userData && this.us.userData.email) {
        this.formGroup.get('email').setValue(this.us.userData.email);
      }
    }
  }

  public showConfirmation() {
    return this.alerts.openModal(ExportSentDialog);
  }

  // public download(data, mimeType, fileName) {
  //   const a = document.createElement('a');
  //   a.setAttribute('style', 'display:none;');
  //   document.body.appendChild(a);
  //   const blob = new Blob([data], { type: mimeType });
  //   const url = window.URL.createObjectURL(blob);
  //   a.href = url;
  //   a.download = fileName;
  //   a.click();
  //   this.close();
  // }

  public enableDisableLimitFiled() {
    if(this.formGroup.get('all').value){
      this.formGroup.get('limit').disable();
      this.formGroup.get('limit').setValue(null);
    }else {
      this.formGroup.get('limit').enable();
    }
  }

  public close(confirmed = false): void {
    this.dialogRef.close(confirmed);
  }
}
