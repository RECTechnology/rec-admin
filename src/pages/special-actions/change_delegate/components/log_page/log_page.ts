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
import { LogType } from 'src/shared/entities/log.ent';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';


@Component({
  selector: 'log_page',
  templateUrl: './log_page.html',
})
export class LogPage {
  public pageName = 'LogPage';
  public id;
  public demoLogs = [];
  public search: string = '';
  public type: LogType = 'DEBUG';
  public stringType: string = 'debug';

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

  typeChanged($evt) {
    if($evt == 'WARNING'){
      this.type = 'WARNING';
      this.stringType = 'warn';
    }else if($evt == 'ERROR') {
      this.stringType = 'error';
      this.type = 'ERROR';
    }else {
      this.stringType = 'debug';
      this.type = 'DEBUG';
    }
    this.searchLogs();
  }

  queryChanged($evt) {
    this.search = $evt;
  }

  syncLogs() {
    // Aqui se sincronizan/get de los logs
    this.type = 'DEBUG';
    this.search.slice();
    this.changeCrud.find(this.id).subscribe((resp) => {
      this.demoLogs = resp.data.logs;
    });
  }

  searchLogs() {
    // Aqui se sincronizan/get de los logs
    this.changeCrud.find(this.id).pipe(debounceTime(2000)).subscribe((resp) => {
      this.demoLogs.length = resp.data.logs.length;
      this.demoLogs = resp.data.logs.filter((el) =>
        el.type == this.stringType
      )
      
    });
  }
}
