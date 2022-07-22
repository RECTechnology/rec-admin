import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertsService } from 'src/services/alerts/alerts.service';


@Component({
    selector: 'send_transactions_modal',
    templateUrl: './send_transactions_modal.html',
})
export class SendTransactionsDia {
    
    public loading: boolean = false;
    public disabled: boolean = false;
    public error: string;
    public totalTransactions=554;
    public sendType="Massive transaction";
    public totalImport=18690.00;
    public warnings=0;
    public dateSend:any;
    public concept="Concept";
    public scheduled: boolean = false;

  

    public types = ['percentage', 'classic', 'free'];
    public offer_image;
    constructor(
        public dialogRef: MatDialogRef<SendTransactionsDia>,
        public us: UserService,
        public translate: TranslateService,
        public alerts: AlertsService,
    ) { }

  
    ngOnInit(){
    }

    ngOnChanges() { }

    public send() {
        this.dialogRef.close(true);
    }
    public close(): void {
        this.dialogRef.close(false);
    }
   
}
