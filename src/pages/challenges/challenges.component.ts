import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageBase } from '../../bases/page-base';
import { LoginService } from '../../services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'challenges',
  templateUrl: './challenges.html',
  styleUrls: ['./challenges.css'],
})
export class ChallengesPage extends PageBase {
  public pageName = 'CHALLENGES';
  public currentTab = 0;
  public sub: any = null;
  public tab: string = '';
  public tabMap = {
    retos: 0,
    premios: 1,
    0: 'challenge',
    1: 'award',
  };

  constructor(
    public ls: LoginService,
    public router: Router,
    public route: ActivatedRoute,
    public titleService: Title,
    public translate: TranslateService,
  ) {
    super(translate);
    this.route.queryParams.subscribe((params) => {
      this.tab = params.tab || 'challenge';
      this.currentTab = this.tabMap[this.tab] || 0;
    });
  }

  public changeUrl($event) {
    this.router.navigate(['/challenges'], {
      queryParams: { tab: this.tabMap[$event] },
      queryParamsHandling: 'merge',
    });
  }
}
