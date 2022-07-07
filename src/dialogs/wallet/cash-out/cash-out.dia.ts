import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from '../../../services/transactions/transactions.service';
import BaseDialog from '../../../bases/dialog-base';
import { WalletService } from '../../../services/wallet/wallet.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Currencies } from 'src/shared/entities/currency/currency';
import { Account } from 'src/shared/entities/account.ent';
type CashOutTxData = {amount: number, concept: string, receiver: Account, sender: Account, sms_code: string, internal_in: any, internal_out: any};
@Component({
  selector: 'cash-out',
  templateUrl: './cash-out.html',
  styleUrls: ['cash-out.css']
})

export class CashOutDia extends BaseDialog {
  public from_address: string = '';
  public tx: CashOutTxData = {
    amount: 0,
    concept: 'cash-out',
    receiver: null,
    sender: null,
    sms_code: '',
    internal_in: false,
    internal_out: false
  };
  public available: number = 0;
  public refundSender: string;
  public refundReceiver: string;
  public txid: string;
  public loading = false;
  public maxAmount: string;
  public refundAmount: string;
  public isMaxAmount: boolean = false;
  public isRefund: boolean = false;
  public accountFilters = {
    // active: 1,
    // type: 'COMPANY',
  };
  public validationErrors  = [];

  constructor(
    public dialogRef: MatDialogRef<CashOutDia>,
    public txService: TransactionService,
    public ws: WalletService,
    public alerts: AlertsService,
  ) {
    super();
  }
  public ngOnInit(){
    if(this.isRefund){
      this.tx.concept = `Devolución a ${this.refundReceiver || '????'}`; 
      this.isMaxAmount ? this.tx.amount =  Number(this.maxAmount) - Number(this.refundAmount) : this.tx.amount = 0;
    }
  }

  public changeBooleanValues(){
    this.tx.internal_in == true ? this.tx.internal_in = 1 : this.tx.internal_in = 0;
    this.tx.internal_out == true ? this.tx.internal_out = 1 : this.tx.internal_out = 0;
  }

  public switchSides() {
    if(this.isRefund){
      return;
    }
    const temp = this.tx.sender;
    this.tx.sender = this.tx.receiver;
    this.tx.receiver = temp;
  }

  public getMaxAmount(){
    this.tx.amount =  Number(this.maxAmount) - Number(this.refundAmount);
  }

  public makeTx() {
    if (this.loading) {
      return;
    }
    this.changeBooleanValues();
    if (!this.tx.receiver) {
      return this.validationErrors.push({ property: 'Origin Account', message: 'Origin account is required' });
    } else if (!this.tx.sender) {
      return this.validationErrors.push({ property: 'Target Account' , message: 'Target account is required' });
    }
    this.loading = true;
    this.txService.sendTx(
      this.tx.sender.id, this.tx.receiver.id,
      this.tx.concept, this.tx.sms_code,
      WalletService.scaleNum(this.tx.amount, Currencies.REC.scale), this.tx.internal_out,
      this.tx.internal_in
    ).subscribe((resp) => {
      this.alerts.showSnackbar('SENT_CORRECTLY');
      this.close(true);
    }, (err) => {
      this.alerts.showSnackbar(err.message);
      this.loading = false;
    });
  }

  public doRefund(){
    this.changeBooleanValues();
    this.loading = true;
    this.txService.refundTx(
      this.tx.concept, this.tx.sms_code, 
      this.txid, WalletService.scaleNum(this.tx.amount, Currencies.REC.scale), this.tx.internal_out,
      this.tx.internal_in,).subscribe((resp) => {
        this.alerts.showSnackbar('REFUND_CORRECTLY');
        this.close(true);
      }, (err) => {
        this.alerts.observableErrorSnackbar(err);
        this.loading = false;
      })
  }
}
