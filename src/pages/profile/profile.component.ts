import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from '../../services/controles/controles.service';
import { UserService } from '../../services/user.service';
import { CompanyService } from '../../services/company/company.service';
import { PageBase } from '../../bases/page-base';
import { LoginService } from '../../services/auth.service';

@Component({
  selector: 'profile',
  styleUrls: [
    './profile.css',
  ],
  templateUrl: './profile.html',
})
export class ProfileComponent extends PageBase implements OnInit, OnDestroy {
  public currentTab = 4;
  public pageName = 'Profile';
  private sub: any = null;
  private tab: string = '';
  private tabMap = {
    accounts: 0,
    0: 'accounts',
  };

  constructor(
    public titleService: Title,
    public route: ActivatedRoute,
    public router: Router,
    public controles: ControlesService,
    public us: UserService,
    private compService: CompanyService,
    public ls: LoginService,
  ) {
    super();
  }

  public ngOnInit() {
    // Gets the query parameters and gets 'tab' param
    this.sub = this.route.queryParams
      .subscribe((params) => {
        this.tab = params.tab || 'companies';
        this.currentTab = this.tabMap[this.tab] || 0;
      });
  }

  // Called when tab change, so url changes also
  public changeUrl($event) {
    this.router.navigate(['user'], { queryParams: { tab: this.tabMap[$event] } });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
