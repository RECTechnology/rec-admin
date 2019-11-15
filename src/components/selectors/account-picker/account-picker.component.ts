import { Component, OnInit, Input } from '@angular/core';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { environment } from 'src/environments/environment';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountPickerDia } from './account-picker-dialog/account-picker.dia';
import { Account } from 'src/shared/entities/account.ent';

@Component({
  selector: 'account-picker',
  templateUrl: './account-picker.component.html',
  styleUrls: ['./account-picker.component.scss'],
})
export class AccountPickerComponent {
  @Input('id') public accountId = null;
  @Input() public disabled = false;

  public selectedAccount: Account | any;
  public Brand = environment.Brand;

  constructor(
    public accountCrud: AccountsCrud,
    public alerts: AlertsService,
  ) { }

  public ngOnChanges() {
    console.log('changed', this.accountId);
    this.search();
  }

  public openSelectAccount() {
    console.log('openSelectAccount');
    this.alerts.openModal(AccountPickerDia, {
      currentAccountId: this.selectedAccount && this.selectedAccount.id,
    }).subscribe((account: Account) => {
      this.selectedAccount = account;
    });
  }

  public search() {
    if (this.accountId) {
      console.log('this.account', this.accountId);
      this.accountCrud.find(this.accountId)
        .subscribe((account) => {
          this.selectedAccount = account.data;
        });
    } else {
      console.log('!this.account');
      this.selectedAccount = {};
    }

    console.log('this.account', this.selectedAccount);
  }
}
