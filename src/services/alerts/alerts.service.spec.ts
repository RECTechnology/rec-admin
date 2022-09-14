import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { AppModule } from "src/app/app.module";
import { AlertsService } from './alerts.service';
import { MatDialog } from '@angular/material/dialog';

describe('AlertsService', () => {
    afterEach(() => {
        TestBed.resetTestingModule();
      }); beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [AppModule, HttpClientTestingModule],
        });
      });

      it('should be created', () => {
        const alertsService: AlertsService = TestBed.inject(AlertsService);
        expect(alertsService).toBeTruthy();
      });

      it('Show snackbar', () => {
        const alertsService: AlertsService = TestBed.inject(AlertsService);
        expect(()=> alertsService.showSnackbar('Hello, world!')).not.toThrowError();
      });

      it('Show snackbar with wrong data', () => {
        const alertsService: AlertsService = TestBed.inject(AlertsService);
        expect(()=> alertsService.showSnackbar(true)).toThrowError();
      });

      it('Show confirmation', () => {
        const alertsService: AlertsService = TestBed.inject(AlertsService);
        expect(()=> alertsService.showConfirmation('Hello world',{},'Hello world')).not.toThrowError();
      });

      it('Show confirmation calls openModal', () => {
        const alertsService: AlertsService = TestBed.inject(AlertsService);
        spyOn(alertsService, 'openModal');

        alertsService.showConfirmation('Hello world',{},'Hello world');

        expect(alertsService.openModal).toHaveBeenCalled();
      });

      it('observableErrorSnackbar builds correctly and calls snackbar', () => {
        const alertsService: AlertsService = TestBed.inject(AlertsService);
        spyOn(alertsService, 'showSnackbar');

        expect(() => alertsService.observableErrorSnackbar({})).not.toThrowError;
        alertsService.observableErrorSnackbar({});
        expect(alertsService.showSnackbar).toHaveBeenCalled();
      });

      it('createModal builds correctly and calls createModal', () => {
        const alertsService: AlertsService = TestBed.inject(AlertsService);
        const dialog: MatDialog = TestBed.inject(MatDialog);
        spyOn(dialog, 'open');

        expect(()=> alertsService.createModal({})).not.toThrowError;
        alertsService.createModal({});
        expect(dialog.open).toHaveBeenCalled();
      });
});