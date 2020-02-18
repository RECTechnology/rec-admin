import { Component, AfterContentInit } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'info',
  templateUrl: './info.html',
})

export class InfoMessage implements AfterContentInit {
  public message: string = '';
  public title: string = '';
  public code: boolean = false;
  public btnAction = this.close.bind(this, true);
  public btnText = '';
  public sanitized_message;

  constructor(
    public dialogRef: MatDialogRef<InfoMessage>,
    private sanitizer: DomSanitizer,
  ) { }

  public ngAfterContentInit() {
    this.sanitized_message = this.sanitizer.bypassSecurityTrustHtml(this.message);
  }

  public close(confirmed): void {
    this.dialogRef.close(confirmed);
  }
}
