import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from 'src/services/controles/controles.service';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';
import BaseDialog from 'src/bases/dialog-base';
import { SelectAccountsDia } from 'src/pages/change_delegate/components/select_accounts_dialog/select_accounts.dia';
import { ConfirmationMessage } from 'src/components/dialogs/confirmation-message/confirmation.dia';
import { Observable, forkJoin } from 'rxjs';

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
        public snackbar: MySnackBarSevice,
        public route: ActivatedRoute,
        public router: Router,
        public controls: ControlesService,
        public mailing: MailingCrud,
        public dialog: MatDialog,
    ) {
        super();
    }

    public openSelectAccounts() {
        const ref = this.dialog.open(SelectAccountsDia, { width: '80vw', height: '80vh' });
        ref.componentInstance.selectedAccounts = this.selectedAccounts.slice();
        ref.componentInstance.newSelectedAccounts = this.selectedAccounts.slice();
        ref.componentInstance.sortType = '';
        ref.componentInstance.showEdit = false;

        ref.afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.selectedAccounts = result.accounts;
                }
            });
    }

    public createDelivery() {
        const dialogRef = this.dialog.open(ConfirmationMessage);
        dialogRef.componentInstance.status = 'warning';
        dialogRef.componentInstance.title = 'Send Delivery';
        dialogRef.componentInstance.message = 'DELIVERY_WARNIGN';
        dialogRef.componentInstance.btnConfirmText = 'Send';
        dialogRef.componentInstance.headerIcon = 'warning';

        dialogRef.afterClosed().subscribe((resp) => {
            if (resp) {
                this.loading = true;
                const subs = [];
                for (const account of this.selectedAccounts) {
                    subs.push(this.mailDeliveries.create({ account_id: account.id, mailing_id: this.id }));
                }

                forkJoin(subs)
                    .subscribe(
                        (result) => {
                            this.snackbar.open('Created ' + subs.length + ' deliveries correctly!', 'ok');
                            this.loading = false;
                            this.close();
                        },
                        (error) => {
                            this.snackbar.open(error.message, 'ok');
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
