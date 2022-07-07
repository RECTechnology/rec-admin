import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import BaseDialog from '../../../bases/dialog-base';
import { WalletService } from '../../../services/wallet/wallet.service';
import { Router } from '@angular/router';
import { CashOutDia } from 'src/dialogs/wallet/cash-out/cash-out.dia';
import { AccountsCrud } from '../../../services/crud/accounts/accounts.crud';
import { Account } from 'src/shared/entities/account.ent';
import { TransactionService } from '../../../services/transactions/transactions.service';
import { AlertsService } from '../../../services/alerts/alerts.service';

@Component({
  selector: 'tx-details',
  templateUrl: './tx-details.html',
})
export class TxDetails extends BaseDialog implements OnInit {
  public transaction: any = {};
  public historicTransactions = [];
  public hasRefunds = true;
  public refundAmound: number = 0;
  public isFromAccountMovements = false;
  public groupAccount: Account;
  public InAccount: Account;
  public loadingView: boolean;

  constructor(
    public dialogRef: MatDialogRef<TxDetails>,
    public us: UserService,
    public ws: WalletService,
    public router: Router,
    public dialog: MatDialog,
    public accountsCrud: AccountsCrud,
    public transactionService: TransactionService,
    public alertsService: AlertsService
  ) {
    super();
  }

  public action = (a, b) => { return; };

  public ngOnInit() {
    this.getAccount();
    this.getRecordTx();
  }

  public redirectToAccount(event){
    window.open('/accounts/' + event.target.innerHTML);

  }

  public getRecordTx(){
    this.loadingView = true;
    const tx = this.transaction.refund_parent_transaction ?? {...this.transaction};
    const refundTx = tx && tx.refund_txs ? tx.refund_txs : null;
    this.historicTransactions.push(tx);
    if(refundTx){
      refundTx.forEach(id => {
        this.transactionService.getTxById(id).subscribe(resp => {
          this.historicTransactions.push(resp);
          this.historicTransactions.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
          this.refundAmound += resp.amount;
        })
      })  
    }
    this.loadingView = false;
  }

  public updateInternal(){
    this.transactionService.updateTx(this.transaction.id, {internal: this.transaction.internal}).subscribe(resp => {
      this.alertsService.showSnackbar('TX_EDITED');
    },(error) =>{
      this.alertsService.observableErrorSnackbar(error);
      this.transaction.internal = !this.transaction.internal;
    });
  }

  public changeTransaction(event){
    this.loadingView = true;
    this.transactionService.getTxById(event.value).subscribe(resp => {
      this.transaction = resp;
      this.loadingView = false;
    },(error) => {
      this.alertsService.observableErrorSnackbar(error);
      this.loadingView = false;
    });
  }

  public getAccount(){
    this.accountsCrud.find(this.transaction.group).subscribe(resp => {
      this.groupAccount = resp.data;
    })
  }

  public doRefund() {
    this.close();
    const dialogRef = this.dialog.open(CashOutDia);
    const txType = this.transaction.pay_in_info ?? this.transaction.pay_out_info;
    dialogRef.componentInstance.isRefund = true;
    dialogRef.componentInstance.maxAmount = this.scaleNum(this.transaction.amount, this.transaction.scale);
    dialogRef.componentInstance.isMaxAmount = true;
    dialogRef.componentInstance.refundSender = this.transaction && this.transaction.pay_out_info ? 
    this.transaction.pay_out_info.name_receiver : this.groupAccount.name;
    dialogRef.componentInstance.refundReceiver = this.transaction && this.transaction.pay_in_info ? 
    this.transaction.pay_in_info.name_sender : this.groupAccount.name;
    dialogRef.componentInstance.txid = txType.txid;
    dialogRef.componentInstance.refundAmount = this.scaleNum(this.refundAmound, this.transaction.scale);
  }

  public scaleNum(number, scale) {
    return (number / Math.pow(10, scale)).toFixed(scale);
  }

  public close(): void {
    this.dialogRef.close(true);
    this.historicTransactions = [];
  }
}
