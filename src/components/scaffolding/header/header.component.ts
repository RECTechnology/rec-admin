import { Component } from '@angular/core';
import { ControlesService } from '../../../services/controles/controles.service';
import { UserService } from '../../../services/user.service';
import { LoginService } from '../../../services/auth/auth.service';
import { WalletService } from '../../../services/wallet/wallet.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'header-nav',
  styleUrls: ['./header.css'],
  templateUrl: './header.html',
})
export class HeaderComponent {
  public Brand: any = environment.Brand;
  public brand: any = environment.Brand;
  public refreshObs;
  public view_price = false;
  constructor(
    public us: UserService,
    public controles: ControlesService,
    public ls: LoginService,
    public ws: WalletService,
    public utils: UtilsService,
  ) { }

  public logout(): void {
    this.ls.logout();
  }
}