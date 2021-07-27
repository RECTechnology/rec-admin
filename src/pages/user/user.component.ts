import { Component, OnInit } from '@angular/core';
import {  MatDialog } from '@angular/material/dialog';
import { SmsService } from '../../services/sms/sms.service';
import { CompanyService } from '../../services/company/company.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UserService } from 'src/services/user.service';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from 'src/services/controles/controles.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { LoginService } from 'src/services/auth/auth.service';
import { EventsService } from 'src/services/events/events.service';
import { PageBase } from 'src/bases/page-base';
import { OnDestroy } from '@angular/core';

@Component({
  providers: [SmsService],
  selector: 'User',
  templateUrl: './user.html',
})
export class UserComponent extends PageBase implements OnInit, OnDestroy{
  public pageName = 'User';
  public currentTab = 0;
  public user_id = null;
  public sub: any = null;
  public pdfHtml = '';
  public tab: string = '';
  public tabMap = {
    details: 0,
    
    0: 'details',
   
  };

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public controles: ControlesService,
    public router: Router,
    public us: UserService,
    public companyService: CompanyService,
    public utils: UtilsService,
    public ls: LoginService,
    public dialog: MatDialog,
    public crudUsers: UsersCrud,
    public alerts: AlertsService,
    public events: EventsService,
    
  ) {
    super();
  }

  public ngOnInit() {
    this.events.registerEvent('user:update').subscribe(this.loadUser.bind(this));

    // Gets the query parameters and gets 'tab' param
    this.sub = this.route.queryParams
      .subscribe((params) => {
        this.tab = params.tab || 'details';
        this.currentTab = this.tabMap[this.tab] || 0;
      });

    this.route.params.subscribe((params) => {
      this.user_id = params.id;
      this.pageName = 'User (' + this.user_id + ')';
      this.loadUser();
    });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
    this.events.removeEvent('user:update');
  }

  public loadUser() {
    console.log("Printing userIddddddddddddd");
    console.log(this.user_id);
    this.loading = true;
    this.crudUsers.find(this.user_id)
      .subscribe((resp: any) => {
        console.log("All nice");
        console.log(resp);
        this.companyService.selectedCompany = resp.data;
        console.log(this.companyService);
        this.loading = false;
      }, (error) => {
        this.loading = false;
      });
  }

  /* Called when tab change, so url changes also */
  public changeUrl($event) {
    console.log("Changing url")
    if (this.user_id) {
      this.router.navigate(['/user/' + this.user_id], {
        queryParams: { tab: this.tabMap[$event] },
        queryParamsHandling: 'merge',
      });
    }
  }

  public goBack() {
    this.router.navigate(['/user']);
  }
}
