import { Component, OnInit } from '@angular/core';
import { MatDialogRef, Sort } from '@angular/material';
import { CurrenciesService } from '../../../../services/currencies/currencies.service';
import BaseDialog from '../../../../bases/dialog-base';
import { CompanyService } from '../../../../services/company/company.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'edit-accounts',
  styleUrls: [
    './edit_accounts.css',
  ],
  templateUrl: './edit_accounts.html',
})
export class EditAccountsDia extends BaseDialog implements OnInit {

  public accountCount = 0;
  public accounts = [];
  public exchanger = { id: 0 };
  public amount = 0;
  public isSingle = false;

  public pan = null;
  public cvv2 = null;
  public month = null;
  public year = null;

  public exchangerQuery = '';
  public exchangers: any[] = [];
  public filtered: any[] = [];

  constructor(
    public currencies: CurrenciesService,
    public dialogRef: MatDialogRef<EditAccountsDia>,
    public company: CompanyService,
    public us: UserService,
  ) {
    super();
    this.getExchangersList();
  }

  public selectionChanged() {
    if (this.filtered.length <= 0) {
      this.exchangerQuery = '';
      this.filtered = this.exchangers.slice();
    }
  }

  public getExchangersList() {
    this.us.getListOfRecSellers(0, 1000, '').subscribe(
      (resp) => {
        this.exchangers = resp.elements;
        this.filtered = this.exchangers.slice();
      },
      (error) => {
        return;
      },
    );
  }

  public onInput() {
    if (this.exchangerQuery === '') {
      return this.filtered = this.exchangers.slice();
    }

    this.filtered = this.exchangers.slice()
      .filter((el) => (
        el.name.includes(this.exchangerQuery) ||
        String(el.id).includes(this.exchangerQuery)
      ));
  }

  public ngOnInit() {
    this.accountCount = this.accounts.length;
    this.isSingle = this.accountCount === 1;

    if (this.isSingle) {
      this.amount = this.accounts[0].amount;
      this.exchanger = this.accounts[0].exchanger;
      this.pan = this.accounts[0].pan;

      const date = this.accounts[0].expiry_date ? this.accounts[0].expiry_date.split('/') : [];

      this.month = date[0];
      this.year = date[1];
      this.cvv2 = this.accounts[0].cvv2;
    }
  }

  public close(): void {
    this.dialogRef.close({ accounts: false });
  }

  public confirm(): void {
    this.dialogRef.close({
      accounts: this.accounts.map((el) => {
        el.amount = this.amount;
        el.exchanger = { id: this.exchanger.id };
        el.pan = this.pan;

        if (this.month && this.year) {
          el.expiry_date = this.month + '/' + this.year;
        }
        el.cvv2 = this.cvv2;
        return el;
      }),
    });
  }
}
