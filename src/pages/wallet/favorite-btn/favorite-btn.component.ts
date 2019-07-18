import { Component, Input } from '@angular/core';
import { WalletService } from '../../../services/wallet/wallet.service';

@Component({
  selector: 'favorite-btn',
  templateUrl: './favorite-btn.html',
})

export class FavoriteBTN {
  @Input('method') public method = {};
  @Input('type') public type = '';
  @Input('direction') public dir = '';

  constructor(
    private ws: WalletService,
  ) { }
}
