import { Component, SimpleChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { Account } from 'src/shared/entities/account.ent';
import { SendTransactionsDia } from '../../change_delegate/components/new_massive_transactions/send_transaction_modal/send_transactions_modal';


@Component({
    selector: 'add-b2b-modal',
    templateUrl: './b2b-modal.html',
})
export class AddB2BModal {

    public loading: boolean = false;
    public disabled: boolean = false;
    public error: string;
    public account: Account;
    public username = '';

    constructor(
        public dialogRef: MatDialogRef<SendTransactionsDia>,
        public crudAccounts: AccountsCrud,
        public translate: TranslateService,
        public alerts: AlertsService,
    ) { }

    ngOnInit() { }

    ngOnChanges() { }

    public send() {
        this.dialogRef.close({
            accountId:this.account
        });
    }
    public setAccount(event) {
        console.log("Im in setAccount",event);
        if (event) {
            this.account = event;
            console.log("Im in setAccount",event);
            console.log("Im in setAccount",this.account);

        }
    }
    public close(): void {
        this.dialogRef.close(false);
    }

}