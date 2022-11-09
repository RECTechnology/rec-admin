import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ControlesService } from '../../../services/controles/controles.service';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../../../services/utils/utils.service';
import { SIDEMENU_ITEMS } from './sidemenu-items';
import { AppService } from 'src/services/app/app.service';
import { ConfigurationSettingsCrud } from '../../../services/crud/config_settings/configuration_settings';
import { ConfigSettings } from 'src/services/configuration_settings/configuration_settings.service';

@Component({
  selector: 'sidemenu',
  styleUrls: ['./sidemenu.css'],
  templateUrl: './sidemenu.html',
})
export class SidemenuComponent {
  public brand: any = environment.Brand;
  public environment = environment;
  public items = SIDEMENU_ITEMS;
  public configurationSettingsData = null;
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
    public crud: ConfigurationSettingsCrud,
    public configService: ConfigSettings
  ) {}

  public ngOnInit() {
    this.toggled = this.controles.isToggled('sidemenu');
    this.handler = this.controles.addHandler('sidemenu', (toggled) => {
      this.toggled = toggled;
    });
    this.getApiVersion();
    this.configService.searchSettings().subscribe( resp => {
      if(resp){
        this.extractItems();
      }
    })
    this.extractItems();
  }

  public getApiVersion() {
    this.app.getInfo().subscribe((resp) => {
      this.apiVersion = resp.data.version;
    });
  }

  public extractItems(){
    if(this.configService.configuration_items){
      this.configService.configuration_items.map( item => {
        if(item.name === 'menu_item_email' && item.value === 'disabled'){
          this.items = this.items.filter(item => {
            return item.name !== 'REC_MAILING';
          })
        }else {
          this.items.map(item => {
            if(item.name === 'REC_MAILING'){
              item.hide = false;
            }
          })
        }
        if(item.name === 'menu_item_b2b' && item.value === 'disabled'){
          this.items = this.items.filter(item => {
            return item.name !== 'B2B';
          })
        }
        else {
          this.items.map(item => {
            if(item.name === 'B2B'){
              item.hide = false;
            }
          })
        }
        if(item.name === 'menu_item_qualifications' && item.value === 'disabled'){
          this.items = this.items.filter(item => {
            return item.name !== 'Ratings';
          })
        }
        else {
          this.items.map(item => {
            if(item.name === 'Ratings'){
              item.hide = false;
            }
          })
        }
        if(item.name === 'menu_item_reports' && item.value === 'disabled'){
          this.items = this.items.filter(item => {
            return item.name !== 'CAMPAIGN_REPORTS';
          })
        }else {
          this.items.map(item => {
            if(item.name === 'CAMPAIGN_REPORTS'){
              item.hide = false;
            }
          })
        }
      })
    }
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
