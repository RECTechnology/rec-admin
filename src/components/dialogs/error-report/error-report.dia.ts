/* tslint:disable */
import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { Brand } from '../../../environment/brand';
import { FileUpload } from '../file-upload/file-upload.dia';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorManager } from '../../../services/error-manager/error-manager'
import { ControlesService } from '../../../services/controles/controles.service';
import { AppService } from '../../../services/app.service'
import { MySnackBarSevice } from '../../../bases/snackbar-base'

declare let html2canvas;
@Component({
  selector: 'error-reporter',
  templateUrl: '../../../components/dialogs/error-report/error-report.html',
  providers: [
    AppService
  ]
})

export class ErrorReporter implements OnInit {
  screenshot = '';
  brand = Brand;
  error_message = '';
  error_title = '';
  currentPath = '';
  errors: number = 0;
  sentReport = false;
  loading = false;
  screenshotImg: any = null;
  sendScreenShot = true;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<ErrorReporter>,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private errMan: ErrorManager,
    private controles: ControlesService,
    private appService: AppService,
    private snackbar: MySnackBarSevice
  ) {
    this.errors = this.errMan.getLength();
  }

  ngOnInit() {
    this.currentPath = this.router.url;
    this.takeScreenshot();
  }

  /**
  * @param {HTMLElement} el #optional
  *   - If passed it will screenshot that elements
  *   - If not it will screenshot '.page'
  */
  takeScreenshot(el?: any) {
    try {
      this.screenshot = this.screenshotImg ||
        html2canvas(el || document.querySelector('.mat-dialog-container') || document.querySelector('.page'))
          .then(canvas => this.screenshot = canvas.toDataURL("image/png"));
    } catch (error) {
      alert('Seems like your browser does not allow screenshoting, please upload one yourself')
    }
  }

  uploadScreenShot() {
    let dialogRef = this.dialog.open(FileUpload);
    dialogRef.componentInstance.title = 'Upload Error Screenshot';
    dialogRef.componentInstance.noImageName = 'no_image_image';
    dialogRef.afterClosed().subscribe(src => {
      if (src) {
        this.screenshot = src;
      }
      dialogRef = null;
    });
  }

  private sendReport() {
    this.loading = true;
    this.appService.sendErrorReport(
      this.error_title,
      this.error_message,
      this.sendScreenShot ? this.screenshotImg : null,
      this.errMan.getErrors(),
      this.currentPath
    ).subscribe(
      resp => {
        this.snackbar.open('Report sent correctly! Thank for your help!', 'ok', { duration: 3500 })
        this.loading = false;
        this.close();
      },
      error => {
        this.error = error._body.message;
        this.snackbar.open('Error sending report, Ironic...', 'ok', { duration: 3500 })
        this.loading = false;
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
