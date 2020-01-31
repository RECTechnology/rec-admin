import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ControlesService } from '../../../services/controles/controles.service';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../../../services/utils/utils.service';
import { SIDEMENU_ITEMS } from './sidemenu-items';

@Component({
  selector: 'sidemenu',
  styleUrls: ['./sidemenu.css'],
  templateUrl: './sidemenu.html',
})
export class SidemenuComponent {
  public brand: any = environment.Brand;
  public environment = environment;
  public items = SIDEMENU_ITEMS;
  public toggled = true;
  public handler = null;
  public statusMask = {
    bnode: false,
    nrdb: false,
    rdb: false,
  };

  constructor(
    public controles: ControlesService,
    public us: UserService,
    public dialog: MatDialog,
    public utils: UtilsService,
  ) { }

  public ngOnInit() {
    this.toggled = this.controles.isToggled('sidemenu');
    this.handler = this.controles.addHandler('sidemenu', (toggled) => this.toggled = toggled);
  }

  public ngOnDestroy() {
    if (this.handler) {
      this.handler.remove();
    }
  }

  public clickedItem() {
    return false;
  }
}
