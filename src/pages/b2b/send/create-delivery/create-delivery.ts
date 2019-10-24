import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from 'src/services/controles/controles.service';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';
import BaseDialog from 'src/bases/dialog-base';
import { SelectAccountsDia } from 'src/pages/change_delegate/components/select_accounts_dialog/select_accounts.dia';
import { forkJoin } from 'rxjs';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
    selector: 'create-delivery',
    templateUrl: './create-delivery.html',
})
export class CreateDelivery {
    @Input() public id = null;
    @Input() public loading = false;
    @Input() public deliveries = [];
    @Input() public disabled = false;
    @Input() public selectedAccounts = [];
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
    ) {
        // super();
    }

    public openSelectAccounts() {
        this.alerts.openModal(SelectAccountsDia, {
            newSelectedAccounts: this.selectedAccounts.slice(),
            selectedAccounts: this.selectedAccounts.slice(),
            showEdit: false,
            sortType: '',
        }, { width: '80vw', height: '80vh' }).subscribe((result) => {
            if (result) {
                this.createDelivery(result.accounts);
            }
        });
    }

    public createDelivery(accounts) {
        this.loading = true;
        this.selectedAccounts = accounts;

        const subs = [];
        for (const account of this.selectedAccounts) {
            subs.push(this.mailDeliveries.create({ account_id: account.id, mailing_id: this.id }));
        }

        forkJoin(subs)
            .subscribe(
                (result) => {
                    this.alerts.showSnackbar('Created ' + subs.length + ' deliveries correctly!', 'ok');
                    this.loading = false;
                    this.update.emit();
                },
                (error) => {

                    console.log(error);
                    this.alerts.showSnackbar(error.message, 'ok');
                    this.loading = false;
                    // if (error.message.includes('Validation error')) {
                    //     this.validationErrors = error.errors;
                    // } else {
                    //     this.alerts.showSnackbar(error.message, 'ok');
                    // }
                },
            );
    }

    public removeAccount(i) {
        const acc = this.selectedAccounts[i];
        console.log('acc', acc);
        this.selectedAccounts.splice(i, 1);
        this.mailDeliveries.remove(acc.delivery_id).subscribe(
            (result) => {
                this.alerts.showSnackbar('Removed delivery correctly!', 'ok');
                this.loading = false;
                this.update.emit();
            },
            (error) => {
                console.log(error);
                this.alerts.showSnackbar(error.message, 'ok');
                this.loading = false;
            },
        );
    }
}
