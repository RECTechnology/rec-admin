import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { CurrenciesService } from '../../../../services/currencies/currencies.service';
import { TransactionService } from '../../../../services/transactions/transactions.service';
import { MySnackBarSevice } from '../../../../bases/snackbar-base';
import BaseDialog from '../../../../bases/dialog-base';
import { WalletService } from '../../../../services/wallet/wallet.service';
import { CompanyService } from '../../../../services/company/company.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'add-currency',
  templateUrl: './add-currency.html',
})
export class AddCurrency {
  public showHeader = false;
  public disabled = false;
  private hiddenCurrencies = [];

  constructor(
    public currencies: CurrenciesService,
    public ws: WalletService,
    public snackbar: MySnackBarSevice,
    public companyService: CompanyService,
    public us: UserService,
  ) {
  }

  public ngAfterContentInit() {
    return;
  }
}

@Component({
  selector: 'add-currency-dia',
  templateUrl: './add-currency.html',
})
export class AddCurrencyDia extends AddCurrency {
  public showHeader = true;
  constructor(
    public currencies: CurrenciesService,
    public ws: WalletService,
    public snackbar: MySnackBarSevice,
    public companyService: CompanyService,
    public dialogRef: MatDialogRef<AddCurrency>,
    public us: UserService,
  ) {
    super(
      currencies,
      ws,
      snackbar,
      companyService,
      us,
    );
  }
  public setReference(ref: MatDialogRef<any>) {
    this.dialogRef = ref;
  }
  public close() {
    this.dialogRef.close();
  }
}
