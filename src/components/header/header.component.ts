import { Component } from '@angular/core';
import { ControlesService } from '../../services/controles/controles.service';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/auth.service';
import { Brand } from '../../environment/brand';
import { WalletService } from '../../services/wallet/wallet.service';
import { UtilsService } from '../../services/utils/utils.service';
import { CompanyService } from '../../services/company/company.service';

@Component({
  selector: 'header-nav',
  styleUrls: ['../../components/header/header.css'],
  templateUrl: '../../components/header/header.html',
})
export class HeaderComponent {
  public Brand = Brand;
  public brand = Brand;
  public refreshObs;
  public view_price = false;
  constructor(
    private us: UserService,
    private controles: ControlesService,
    private ls: LoginService,
    private ws: WalletService,
    private utils: UtilsService,
    private companyService: CompanyService,
  ) { }

  public logout(): void {
    this.ls.logout();
  }
}
