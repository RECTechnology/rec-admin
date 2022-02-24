import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() public account = null;
  @Input() public id = null;
  @Input() public showKeyboard = false;
  @Output() public idChange: EventEmitter<any> = new EventEmitter();
  @Output() public accountChange: EventEmitter<any> = new EventEmitter();
  @Input() public disabled = false;
  @Input() public filters = {};

  public isKeyboard = false;
  public selectedAccount: any = {};
  public Brand = environment.Brand;

  constructor(
    public accountCrud: AccountsCrud,
    public alerts: AlertsService,
  ) { }

  public ngOnChanges() {
    this.search();
  }

  public openSelectAccount() {
    this.alerts.openModal(AccountPickerDia, {
      currentid: this.selectedAccount && this.selectedAccount.id,
      filters: this.filters,
    }).subscribe(this.selectAccount.bind(this));
  }

  public selectAccount(account: Partial<Account>) {
    if (!account || !account.id) {
      this.accountChange.emit(null);
      this.idChange.emit(null);
      this.id = null;
      return;
    }

    this.selectedAccount = account;
    this.accountChange.emit(this.selectedAccount);
    this.idChange.emit(this.selectedAccount.id);
    this.id = account.id;
  }

  public getAccount(id) {
    return this.accountCrud.find(id)
      .toPromise()
      .then((resp) => resp.data);
  }

  public search() {
    if (this.account && this.account.id) {
      this.getAccount(this.account.id)
        .then((account) => this.selectAccount(account))
        .catch((err) => this.selectedAccount = {});
    } else if (this.id) {
      this.getAccount(this.id)
        .then((account) => this.selectAccount(account))
        .catch((err) => this.selectedAccount = {});
    } else {
      this.selectedAccount = {};
    }
  }

  public onWrite($event) {
    this.idChange.emit(Number($event));
  }

  public changeMode() {
    this.isKeyboard = !this.isKeyboard;
    if (this.isKeyboard) {
      this.selectedAccount = { id: this.selectedAccount.id };
      this.selectAccount(this.selectedAccount);
    } else {
      this.getAccount(this.selectedAccount.id)
        .then(this.selectAccount.bind(this));
    }
  }
}
