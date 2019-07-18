import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { WalletService } from '../../services/wallet/wallet.service';
import { CurrenciesService } from '../../services/currencies/currencies.service';

@Component({
  selector: 'user-price',
  styles: [
    ':host{ width: 100%}',
  ],
  templateUrl: './user-currency.html',
})
export class UserCurrencyPrice {
  @Input() public currency: string = '';
  @Input() public amount: number = 0;
  private userCurrency = 'EUR';

  constructor(private us: UserService, private ws: WalletService, private cs: CurrenciesService) {
    this.userCurrency = this.us.getCurrency();
  }

  public scaleAmount() {
    return this.amount * +this.cs.getTickerPrice(this.currency);
  }
}
