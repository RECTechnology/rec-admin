import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { Account } from 'src/shared/entities/account.ent';
import { SendTransactionsDia } from '../../change_delegate/components/new_massive_transactions/send_transaction_modal/send_transactions_modal';
import { EmptyValidators } from '../../../../components/validators/EmptyValidators';


@Component({
    selector: 'add-b2b-modal',
    templateUrl: './b2b-modal.html',
})
export class AddB2BModal {

    public loading: boolean = false;
    public disabled: boolean = false;
    public error: string;
    public account: Account;
    public username = null;
    public filter = {"rezero_b2b_access": "not_granted"};
    public formGroup = new FormGroup({
        username: new FormControl(null, [Validators.minLength(3), Validators.required, Validators.pattern(/^[A-Za-z0-9\_\.\-]+$/), EmptyValidators.noWhiteSpace]),
        account: new FormControl("")
    })
    

    constructor(
        public dialogRef: MatDialogRef<SendTransactionsDia>,
        public crudAccounts: AccountsCrud,
        public translate: TranslateService,
        public alerts: AlertsService,
    ) { }

    public ngOnInit() {
     }

    ngOnChanges() { }
    public send() {
        if(this.disabled || (!this.account.rezero_b2b_username && this.formGroup.invalid) || !this.formGroup.dirty){
            return;
        }
        this.loading = true;

        this.account = this.formGroup.get('account').value;
        this.username = this.formGroup.get('username').value;
        this.crudAccounts.update(this.account.id,{rezero_b2b_access:'granted',rezero_b2b_username:this.username ?? this.account.rezero_b2b_username}).subscribe(
            (resp: any) => {
            this.dialogRef.close(resp); 
              this.alerts.showSnackbar(
                "ADDED_TO_B2B",
                'OK'
              );
            this.loading = false; 
            },
            (error) => {
              this.alerts.showSnackbar('Error: ' + error.message, 'ok');
              this.loading = false;
            },
          );
    }
    public setAccount(event) {
        if (event) {
            this.account = event;
        }
    }
    public close(): void {
        this.dialogRef.close(false);
    }

}