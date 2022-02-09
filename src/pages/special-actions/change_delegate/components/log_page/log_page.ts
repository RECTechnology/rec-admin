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

@Component({
  selector: 'log_page',
  templateUrl: './log_page.html',
})
export class LogPage {
  public pageName = 'LogPage';
  public demoLogs = [
    {
      id: 'aa',
      log: 'locate_configFile: Specified configuration file: /u/user10/rsvpd1.conf',
      date: '03/22 08:51:01',
      type: 'DEBUG',
    },
    {
      id: 'aa',
      log: 'settcpimage: Get TCP images rc - EDC8112I Operation not supported on socket.',
      date: '03/22 08:51:01',
      type: 'ERROR',
    },
    {
      id: 'aa',
      log: 'settcpimage: Associate with TCP/IP image name = TCPCS',
      date: '03/22 08:51:01',
      type: 'DEBUG',
    },
    {
      id: 'aa',
      log: 'reg_process: registering process with the system',
      date: '03/22 08:51:01',
      type: 'DEBUG',
    },
  ];

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public controles: ControlesService,
    public router: Router,
    public us: UserService,
    public ls: LoginService,
    public dialog: MatDialog,
    public as: AdminService,
    public accountsCrud: AccountsCrud,
    public alerts: AlertsService,
  ) {}

  linesChanged($evt) {
    console.log('Lines changed', $evt);
  }

  typeChanged($evt) {
    console.log('Type changed', $evt);
  }

  syncLogs() {
    console.log('Sync logs');
    // Aqui se sincronizan/get de los logs
  }
}
