/* tslint:disable */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ControlesService } from '../../services/controles/controles.service';
import { ErrorReporter } from '../dialogs/error-report/error-report.dia';
import { MatDialog } from '@angular/material';
declare let html2canvas;

@Component({
  selector: 'error-report-btn',
  templateUrl: '../../components/error-report-btn/error-report-btn.html'
})
export class ErrorReportBtn {

  constructor(
    private controles: ControlesService,
    private dialog: MatDialog
  ) { }

  onClick() {
    html2canvas(document.querySelector('.mat-dialog-container') || document.querySelector('.page'))
      .then(canvas => {
        this.controles.errorReporterOpened = true;
        let dialogRef = this.dialog.open(ErrorReporter);
        dialogRef.componentInstance.screenshotImg = canvas.toDataURL("image/png");

        dialogRef.afterClosed().subscribe(resp => {
          dialogRef = null;
          this.controles.errorReporterOpened = false;
        })
      });
  }
}
