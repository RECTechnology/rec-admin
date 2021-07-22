import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { MySnackBarSevice } from 'src/bases/snackbar-base';

@Component({
  selector: 'tab-offers',
  templateUrl: './offers.html',
})
export class OffersTab {
  @Input() public id = '';
  @Input() public account: Account;
  @Output() public close: EventEmitter<any> = new EventEmitter();
  @Input() public loading: boolean = false;

  public pageName = 'Offers';

  constructor(
    public accountsCrud: AccountsCrud,
    public snackbar: MySnackBarSevice,
  ) {}

  public ngOnInit() {
    
  }
}
