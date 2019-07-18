import { Component, OnInit, Input } from '@angular/core';
import { ControlesService } from '../../services/controles/controles.service';
import { UserService } from '../../services/user.service';
import { Brand } from '../../environment/brand';
import { ErrorReporter } from '../dialogs/error-report/error-report.dia';
import { MatDialog } from '@angular/material';
import { UtilsService } from '../../services/utils/utils.service';
import { environment } from '../../environment/environment';

@Component({
  selector: 'sidemenu',
  styleUrls: ['../../components/sidemenu/sidemenu.css'],
  templateUrl: '../../components/sidemenu/sidemenu.html',
})
export class SidemenuComponent implements OnInit {
  public brand = Brand;
  public environment = environment;
  public loadEnded = false;
  @Input() public collapsed = null;

  public statusMask = {
    bnode: false,
    nrdb: false,
    rdb: false,
  };

  constructor(
    private contrService: ControlesService,
    private us: UserService,
    private dialog: MatDialog,
    private utils: UtilsService,
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

  public openErrorReporter(): void {
    this.clickedItem();
    let dialogRef = this.dialog.open(ErrorReporter);
    dialogRef.afterClosed().subscribe((resp) => {
      dialogRef = null;
    });
  }
}
