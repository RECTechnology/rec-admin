import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { Account } from 'src/shared/entities/account.ent';
import { environment } from 'src/environments/environment';
import { CrudBaseService } from 'src/services/base/crud.base';

@Component({
  selector: 'account-picker-dia',
  templateUrl: './account-picker-dia.html',
})
export class AccountPickerDia {

  public currentAccountId = null;
  public accounts: Account[] = [];
  public filters = {};
  public type = null;

  public Brand = environment.Brand;
  public loading = true;

  constructor(
    public dialogRef: MatDialogRef<AccountPickerDia>,
    public accountCrud: AccountsCrud,
  ) {}

  public search(query) {
    const opts = {
      offset: 0,
      limit: 50,
      type: this.type,
      search: query,
      ...this.filters,
    };

    this.loading = true;
    this.accountCrud.list(opts)
      .subscribe((resp) => {
        this.accounts = resp.data.elements;
        this.loading = false;
      });
  }

  public select(account) {
    this.close(account);
  }

  public close(account = null): void {
    this.dialogRef.close(account);
  }
}
