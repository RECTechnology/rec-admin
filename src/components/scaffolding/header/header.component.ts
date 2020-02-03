import { Component } from '@angular/core';
import { ControlesService } from '../../../services/controles/controles.service';
import { UserService } from '../../../services/user.service';
import { LoginService } from '../../../services/auth/auth.service';
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
  public isChristmas = false;

  constructor(
    public us: UserService,
    public controles: ControlesService,
    public ls: LoginService,
    public utils: UtilsService,
  ) {
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();

    this.isChristmas = (month === 11 && day > 10) || (month === 0 && day < 7);
  }

  public logout(): void {
    this.ls.logout();
  }
}
