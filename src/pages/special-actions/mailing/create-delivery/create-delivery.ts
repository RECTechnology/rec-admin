import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from 'src/services/controles/controles.service';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';
import {
    SelectAccountsDia,
} from 'src/pages/special-actions/change_delegate/components/select_accounts_dialog/select_accounts.dia';
import { forkJoin } from 'rxjs';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { FileUpload } from 'src/dialogs/other/file-upload/file-upload.dia';

@Component({
    selector: 'create-delivery',
    templateUrl: './create-delivery.html',
})
export class CreateDelivery {
    @Input() public id = null;
    @Input() public loading = false;
    @Input() public disabled = false;

    @Input() public deliveries = [];
    @Input() public selectedAccounts = [];

    public csvFile = null;

    @Output() public update: EventEmitter<any> = new EventEmitter();

    public validationErrors = [];
    public validationErrorName = 'Validation Error';

    constructor(
        // public dialogRef: MatDialogRef<CreateDelivery>,
        public us: UserService,
        public translate: TranslateService,
        public mailDeliveries: MailingDeliveriesCrud,
        public route: ActivatedRoute,
        public router: Router,
        public controls: ControlesService,
        public mailing: MailingCrud,
        public alerts: AlertsService,
    ) { }

    public openSelectAccounts() {
        const ref: any = this.alerts.createModal(SelectAccountsDia, {
            newSelectedAccounts: this.selectedAccounts.slice(),
            selectedAccounts: this.selectedAccounts.slice(),
            showEdit: false,
            sortType: '',
        }, { width: '80vw', height: '80vh' });

        ref.afterClosed().subscribe((result) => {
            if (result) {
                this.createDelivery(result.accounts);
            }
        });
    }

    public openUploadCsv() {
        return this.alerts.openModal(FileUpload, {
            hasSelectedImage: !!this.csvFile,
            selectedImage: this.csvFile,
            title: 'UPLOAD_CSV',
        }).subscribe((csv) => {
            if (csv) {
                this.csvFile = csv;
                this.uploadCsv(csv);
            }
        }, this.alerts.observableErrorSnackbar.bind(this.alerts));
    }

    public uploadCsv(csv) {
        this.mailDeliveries.import({ csv })
            .subscribe((resp) => {
                this.loading = false;
                this.update.emit();
            }, this.alerts.observableErrorSnackbar.bind(this.alerts));
    }

    public createDelivery(accounts) {
        this.loading = true;

        const subs = [];
        for (const account of accounts) {
            const accIdMap = this.selectedAccounts.map((el) => el.id);
            const exists = accIdMap.includes(account.id);
            if (!exists) {
                subs.push(this.mailDeliveries.create({ account_id: account.id, mailing_id: this.id }));
            }
        }

        forkJoin(subs)
            .subscribe(
                (result) => {
                    this.alerts.showSnackbar('Created ' + subs.length + ' deliveries correctly!', 'ok');
                    this.loading = false;
                    this.update.emit();
                    this.selectedAccounts = accounts;
                },
                (error) => {
                    this.alerts.showSnackbar(error.message, 'ok');
                    this.loading = false;
                    if (error.message.includes('Validation error')) {
                        this.validationErrors = error.errors;
                    } else {
                        this.alerts.showSnackbar(error.message, 'ok');
                    }
                },
            );
    }

    public removeAccount(i) {
        const acc = this.selectedAccounts[i];
        this.selectedAccounts.splice(i, 1);
        this.mailDeliveries.remove(acc.delivery_id).subscribe(
            (result) => {
                this.alerts.showSnackbar('REMOVED_DELIVERY_CORRECTLY', 'ok');
                this.loading = false;
                this.update.emit();
            },
            (error) => {
                this.alerts.showSnackbar(error.message, 'ok');
                this.loading = false;
            },
        );
    }
}
