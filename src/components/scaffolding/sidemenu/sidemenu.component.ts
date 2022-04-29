import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ControlesService } from '../../../services/controles/controles.service';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../../../services/utils/utils.service';
import { SIDEMENU_ITEMS } from './sidemenu-items';
import { AppService } from 'src/services/app/app.service';

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
  public apiVersion = '...';

  constructor(
    public controles: ControlesService,
    public us: UserService,
    public dialog: MatDialog,
    public app: AppService,
    public utils: UtilsService,
  ) {}

  public ngOnInit() {
    this.toggled = this.controles.isToggled('sidemenu');
    this.handler = this.controles.addHandler('sidemenu', (toggled) => {
      this.toggled = toggled;
    });
    this.getApiVersion();
  }

  public getApiVersion() {
    this.app.getInfo().subscribe((resp) => {
      this.apiVersion = resp.data.version;
    });
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
