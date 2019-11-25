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
  @Input() public account = null;
  @Input() public id = null;
  @Output() public idChange: EventEmitter<any> = new EventEmitter();
  @Output() public accountChange: EventEmitter<any> = new EventEmitter();
  @Input() public disabled = false;
  @Input() public filters = {};

  public selectedAccount: Account | any = {};
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
    }).subscribe((account: Account) => {
      if (!account || !account.id) {
        this.accountChange.emit(null);
        this.idChange.emit(null);
        return;
      }

      this.selectedAccount = account;
      this.accountChange.emit(this.selectedAccount);
      this.idChange.emit(this.selectedAccount.id);
    });
  }

  public search() {
    console.log('alskdjaslkd', this.account);
    if (this.account && this.account.id) {
      this.accountCrud.find(this.account.id)
        .subscribe((account) => {
          this.selectedAccount = account;
        });
    } else if (this.id) {
      this.accountCrud.find(this.id).subscribe((resp) => {
        this.selectedAccount = resp.data;
      });
    } else {
      this.selectedAccount = {};
    }
  }
}
