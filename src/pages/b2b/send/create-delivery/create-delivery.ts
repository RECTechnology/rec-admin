import { Component } from '@angular/core';
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
export class CreateDelivery extends BaseDialog {
    public id = null;
    public deliveries = [];
    public selectedAccounts = [];

    constructor(
        public dialogRef: MatDialogRef<CreateDelivery>,
        public us: UserService,
        public translate: TranslateService,
        public mailDeliveries: MailingDeliveriesCrud,
        public route: ActivatedRoute,
        public router: Router,
        public controls: ControlesService,
        public mailing: MailingCrud,
        public alerts: AlertsService,
    ) {
        super();
    }

    public openSelectAccounts() {
        this.alerts.openModal(SelectAccountsDia, {
            newSelectedAccounts: this.selectedAccounts.slice(),
            selectedAccounts: this.selectedAccounts.slice(),
            showEdit: false,
            sortType: '',
        }, { width: '80vw', height: '80vh' }).subscribe((result) => {
            if (result) {
                this.selectedAccounts = result.accounts;
            }
        });
    }

    public createDelivery() {
        this.alerts.showConfirmation(
            'DELIVERY_WARNIGN',
            'Send Delivery',
            'Send',
            'warning',
        ).subscribe((resp) => {
            if (resp) {
                this.loading = true;
                const subs = [];
                for (const account of this.selectedAccounts) {
                    subs.push(this.mailDeliveries.create({ account_id: account.id, mailing_id: this.id }));
                }

                forkJoin(subs)
                    .subscribe(
                        (result) => {
                            this.alerts.showSnackbar('Created ' + subs.length + ' deliveries correctly!', 'ok');
                            this.loading = false;
                            this.close();
                        },
                        (error) => {
                            this.alerts.showSnackbar(error.message, 'ok');
                            this.loading = false;
                        },
                    );
            }
        });
    }

    public removeAccount(i) {
        this.selectedAccounts.splice(i, 1);
    }
}
