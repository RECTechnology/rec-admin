import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { interval } from 'rxjs';

import { AppService } from 'src/services/app/app.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/services/utils/utils.service';
import { ControlesService } from 'src/services/controles/controles.service';
import { CompanyService } from 'src/services/company/company.service';
import { LoginService, AppAuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user.service';
import { AdminService } from 'src/services/admin/admin.service';
import { IdleNotification } from 'src/components/dialogs/idle-notification/idle.dia';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { MySentry } from 'src/shared/sentry';

@Component({
  providers: [AppService],
  selector: 'app-rec-admin',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  public isMobile = false;
  public isSandbox = false;
  public initedIdle = false;
  public idleObs: any = null;
  public environment: any = environment;
  public Brand: any = environment.Brand;
  public refreshObs: any = null;
  public idleModal: any = null;

  constructor(
    private translate: TranslateService,
    private utils: UtilsService,
    private cs: ControlesService,
    private companyService: CompanyService,
    private dialog: MatDialog,
    private title: Title,
    private ls: LoginService,
    private aas: AppAuthService,
    private us: UserService,
    public as: AdminService,
    public alerts: AlertsService,
    // public test: UsersCrudService,
  ) {
    this.utils.isSandbox = this.isSandbox = environment.test;

    /* Sanbox stuff */
    if (this.isSandbox) {
      document.body.classList.add('sandbox');
    }
  }

  public ngOnInit() {

    this.aas.doAuth((response, error) => { return; });

    this.title.setTitle(this.Brand.name);

    /* Check if device is movile and open/close sidemenu based on that */
    this.isMobile = this.utils.isMobileDevice = this.utils.isMobile();
    this.utils.openIdleModal = this.showIdleMessage.bind(this);
    this.utils.closeIdleModal = this.closeIdleMessage.bind(this);
    this.cs.sidemenuVisible = !this.utils.isMobileDevice;

    /* Setup translate, and set default lang */
    this.setupLang();

    /**
     * Subscription for when user logs out
     * In case we need to unsubscribe observables from outside LoginSerice
     */
    this.ls.onLogout
      .subscribe((resp) => {
        this.aas.doAuth((response, error) => { return; });
        this.initedIdle = false;
        if (this.idleObs) { this.idleObs.unsubscribe(); }
        if (this.refreshObs) { this.refreshObs.unsubscribe(); }
      });

    /**
     * Subscription for when user does login
     * Because we want to start idle check if user is logged in
     * just the first time so we use this.initedIdle to check if its inited already
     */
    this.ls.onLogin
      .subscribe((resp) => {
        if (resp && !this.initedIdle) {
          this.initCheckIdle();
          this.initedIdle = true;
        }

        /* Setup translate for logged in user, and set default lang */
        this.setupLang();

        this.us.getProfile().subscribe((profile) => {
          this.us.userData = profile;
          MySentry.setUser(profile);

          if (!this.us.isSuperAdmin()) {
            this.us.logout();
            this.alerts.showSnackbar('You don\'t have necesary permissions...', 'OK');
            return;
          }
        }, (error) => { return; });

        // this.as.checkWithdrawals();

        this.companyService.listCategories()
          .subscribe((categories) => {
            this.companyService.categories = categories.data;
          });
      });
  }

  /* Setup translate, and set default lang */
  public setupLang() {
    const browserLang = this.translate.getBrowserLang();
    const localSavedLang = localStorage.getItem('lang');
    const currentLang = localSavedLang || browserLang || 'en';
    this.us.lang = this.utils.userLang = currentLang;
    localStorage.setItem('lang', currentLang);

    /* Sets up @ngx-translate/core */
    this.translate.setDefaultLang('en');
    this.translate.use(currentLang);
  }

  public ngOnDestroy() {
    if (this.idleObs) { this.idleObs.unsubscribe(); }
    if (this.refreshObs) { this.refreshObs.unsubscribe(); }
    this.dialog.closeAll();
  }

  /**
   * Starts idle checking interval,
   * and tracks any action the user does and resets counter back to 0
   */
  public initCheckIdle(): void {
    this.utils.checkIdleTime();
    localStorage.setItem('session_status', 'active');

    const onAction = () => {
      if (localStorage.getItem('session_status') !== 'stand_by') {
        this.utils._idleSecondsCounter = 0;
        localStorage.setItem('login_date', Date.now().toString());
      }
    };

    document.onclick = onAction.bind(this);
    document.onmousemove = onAction.bind(this);
    document.onkeypress = onAction.bind(this);

    this.idleObs = interval(1e3).subscribe((x) => this.utils.checkIdleTime());
  }

  private showIdleMessage(): void {
    this.idleModal = this.dialog.open(IdleNotification);
    this.idleModal.afterClosed().subscribe(
      (resp) => this.idleModal = null,
    );
  }

  private closeIdleMessage(): void {
    if (this.idleModal) { this.idleModal.close(); }
  }
}
