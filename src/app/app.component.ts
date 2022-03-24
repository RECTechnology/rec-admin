import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { AppService } from 'src/services/app/app.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/services/utils/utils.service';
import { ControlesService } from 'src/services/controles/controles.service';
import {
  LoginService,
  AppAuthService,
} from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user.service';
import { IdleNotification } from 'src/dialogs/other/idle-notification/idle.dia';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { MySentry } from 'src/shared/sentry';
import { DateAdapter } from '@angular/material/core';

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
    private dialog: MatDialog,
    private title: Title,
    private ls: LoginService,
    private aas: AppAuthService,
    private us: UserService,
    public alerts: AlertsService,
    public dateAdapter: DateAdapter<any>,
  ) {
    this.utils.isSandbox = this.isSandbox = environment.test;

    /* Sanbox stuff */
    if (this.isSandbox) {
      document.body.classList.add('sandbox');
    }

    this.dateAdapter.setLocale(this.getLocale());
  }

  private getLocale() {
    switch (this.us.lang) {
      case 'en': return 'en-GB';
      case 'ca':
      case 'es': return 'es-ES';
      default: return 'es-ES';
    }
  }

  public ngOnInit() {
    this.aas.doAuth().subscribe((response) => {
      return;
    });

    this.title.setTitle(this.Brand.name);

    /* Check if device is movile and open/close sidemenu based on that */
    this.isMobile = this.utils.isMobileDevice = this.utils.isMobile();
    this.utils.openIdleModal = this.showIdleMessage.bind(this);
    this.utils.closeIdleModal = this.closeIdleMessage.bind(this);

    /* Setup translate, and set default lang */
    this.setupLang();

    /**
     * Subscription for when user logs out
     * In case we need to unsubscribe observables from outside LoginService
     */
    this.ls.onLogout.subscribe((resp) => {
      this.aas.doAuth().subscribe((response) => {
        return;
      });
      this.initedIdle = false;
      if (this.idleObs) {
        this.idleObs.unsubscribe();
      }
      if (this.refreshObs) {
        this.refreshObs.unsubscribe();
      }
    });

    /**
     * Subscription for when user does login
     * Because we want to start idle check if user is logged in
     * just the first time so we use this.initedIdle to check if its inited already
     */
    this.ls.onLogin.subscribe((resp) => {
      if (resp && !this.initedIdle) {
        this.initCheckIdle();
        this.initedIdle = true;
      }

      /* Setup translate for logged in user, and set default lang */
      this.setupLang();

      this.us.getProfile().subscribe(
        (profile) => {
          this.us.userData = profile;

          const roles = profile.group_data.roles;
          this.us.isAdmin =
            roles.includes('ROLE_ADMIN') ||
            roles.includes('ROLE_COMPANY');

          MySentry.setUser(profile);

          if (!this.us.isSuperAdmin()) {
            this.us.logout();
            this.alerts.showSnackbar(
              "DONT_NECESSARI_PERMISSION",
              'OK'
            );
            return;
          }
        },
        (error) => {
          return;
        }
      );
    });
  }

  public setupLang() {
    const browserLang = this.translate.getBrowserLang();
    const localSavedLang = localStorage.getItem('lang');
    let currentLang =
      localSavedLang !== 'undefined'
        ? localSavedLang
        : browserLang || 'en';

    if (!['es', 'cat', 'en'].includes(currentLang)) {
      currentLang = 'en';
    }

    this.us.lang = this.utils.userLang = currentLang;
    localStorage.setItem('lang', currentLang);

    /* Sets up @ngx-translate/core */
    this.translate.setDefaultLang('en');
    this.translate.use(currentLang);
  }

  public ngOnDestroy() {
    if (this.idleObs) {
      this.idleObs.unsubscribe();
    }
    if (this.refreshObs) {
      this.refreshObs.unsubscribe();
    }
    this.dialog.closeAll();
  }

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

    this.idleObs = interval(1e3).subscribe((x) =>
      this.utils.checkIdleTime()
    );
  }

  private showIdleMessage(): void {
    this.idleModal = this.dialog.open(IdleNotification);
    this.idleModal
      .afterClosed()
      .subscribe((resp) => (this.idleModal = null));
  }

  private closeIdleMessage(): void {
    if (this.idleModal) {
      this.idleModal.close();
    }
  }
}
