import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { ControlesService } from 'src/services/controles/controles.service';
import { UserService } from 'src/services/user.service';
import { LoginService } from 'src/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from 'src/services/admin/admin.service';
import { DelegatedChangesCrud } from 'src/services/crud/delegated_changes/delegated_changes';

@Component({
  selector: 'log_page',
  templateUrl: './log_page.html',
})
export class LogPage {
  public pageName = 'LogPage';
  public id;
  public demoLogs = [];

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public controles: ControlesService,
    public changeCrud: DelegatedChangesCrud,
    public router: Router,
    public us: UserService,
    public ls: LoginService,
    public dialog: MatDialog,
    public as: AdminService,
    public accountsCrud: AccountsCrud,
    public alerts: AlertsService,
  ) {}


  ngOnInit(){
    this.route.queryParams
            .subscribe((params) => {
                this.id=params.id;
                    this.syncLogs();

            });
  }

  linesChanged($evt) {
    console.log('Lines changed', $evt);
  }

  typeChanged($evt) {
    console.log('Type changed', $evt);
  }

  syncLogs() {
    console.log('Sync logs');
    // Aqui se sincronizan/get de los logs
    this.changeCrud.find(this.id).subscribe((resp) => {
      this.demoLogs = resp.data.logs
      
  

    });
  }

  
}
