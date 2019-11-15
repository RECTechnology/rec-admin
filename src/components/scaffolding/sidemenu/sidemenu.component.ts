import { Component, OnInit, Input } from '@angular/core';
import { ControlesService } from '../../../services/controles/controles.service';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'sidemenu',
  styleUrls: ['./sidemenu.css'],
  templateUrl: './sidemenu.html',
})
export class SidemenuComponent implements OnInit {
  public brand: any = environment.Brand;
  public environment = environment;
  public loadEnded = false;
  @Input() public collapsed = null;

  public statusMask = {
    bnode: false,
    nrdb: false,
    rdb: false,
  };

  constructor(
    public contrService: ControlesService,
    public us: UserService,
    public dialog: MatDialog,
    public utils: UtilsService,
  ) { }

  public ngOnInit() {
    const roles = this.us.userData.group_data.roles;
    this.us.isAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_COMPANY');
    this.us.isReseller = roles.includes('ROLE_RESELLER');
    this.loadEnded = true;
    if (this.collapsed != null) {
      this.contrService.sidemenuVisible = !this.collapsed;
    }
  }

  public clickedItem(): void {
    if (this.utils.isMobileDevice) {
      this.contrService.toggleSidemenu();
    }
    this.contrService.toggleProfileDropDown(false);
  }
}
