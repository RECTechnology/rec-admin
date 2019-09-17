import { Component, OnInit } from '@angular/core';
import { MatDialogRef, Sort } from '@angular/material';
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
  public isSingleEdit: boolean = false;

  constructor(
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
        this.exchangers = resp.data.elements;
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

    const queryLowerCase = this.exchangerQuery.toLowerCase();
    this.filtered = this.exchangers.slice()
      .filter((el) => (
        String(el.name).toLowerCase().includes(queryLowerCase) ||
        String(el.id).toLowerCase().includes(queryLowerCase)
      ));
  }

  public ngOnInit() {
    this.accountCount = this.accounts.length;
    this.isSingle = this.accountCount === 1;

    if (this.isSingle) {
      // Convert from cents to euros
      this.amount = this.accounts[0].amount / 100;
      this.exchanger = this.accounts[0].exchanger.id;
      this.pan = this.accounts[0].pan;

      const date = this.accounts[0].expiry_date ? this.accounts[0].expiry_date.split('/') : [];

      this.month = date[0];
      this.year = date[1];
      this.cvv2 = this.accounts[0].cvv2;
    } else {
      this.exchanger = this.accounts[0].exchanger;
      this.accounts = this.accounts.map((el) => {
        el.amount = el.amount / 100;
        return el;
      });
    }
  }

  public close(): void {
    this.dialogRef.close({ accounts: false });
  }

  public confirm(): void {
    this.dialogRef.close({
      accounts: this.accounts.map((el) => {
        // Convert euros to cents
        el.amount = this.amount * 100;
        el.exchanger = { id: this.exchanger };
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
