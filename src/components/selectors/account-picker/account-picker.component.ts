import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() public id = null;
  @Output() public idChange: EventEmitter<any> = new EventEmitter();
  @Input() public disabled = false;
  @Input() public filters = {};

  public selectedAccount: Account | any = {};
  public Brand = environment.Brand;

  constructor(
    public accountCrud: AccountsCrud,
    public alerts: AlertsService,
  ) { }

  public ngOnChanges() {
    console.log('changed', this.id);
    this.search();
  }

  public openSelectAccount() {
    console.log('openSelectAccount');
    this.alerts.openModal(AccountPickerDia, {
      currentid: this.selectedAccount && this.selectedAccount.id,
      filters: this.filters,
    }).subscribe((account: Account) => {
      this.selectedAccount = account;
      this.idChange.emit(this.selectedAccount.id);
    });
  }

  public search() {
    if (this.id) {
      console.log('this.account', this.id);
      this.accountCrud.find(this.id)
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
