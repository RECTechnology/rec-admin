import { Component, OnInit, ViewChildren, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { LoginService, AppAuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { environment } from '../../environment/environment';
import { Brand } from '../../environment/brand';
import { DevOptions } from './dev-options/dev-options.dia';
import { BetaTerms } from './beta-terms/beta-terms.dia';
import { DataProtection } from './data-protection/data-protection.dia';
import { MySnackBarSevice } from '../../bases/snackbar-base';
import { ChangePassword } from '../../pages/profile/dialogs/change-password/change-password.dia';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'login',
  styleUrls: [
    '../../components/login/login.css',
  ],
  templateUrl: '../../components/login/login.html',
})
export class LoginComponent implements OnInit {
  public env_checked = !environment.test;
  public errorMessage = '';
  public loading = false;
  public disabled = false;
  public two_fa_required = false;
  public credentials = {
    password: '',
    two_fa: '',
    username: '',
  };
  public gotToken = false;
  public showPopup = false;
  public acceptedBetaTerms = false;
  public environment = environment;
  public date_timestamp = Date.now();
  public needs_two_fa = false;
  public Brand = Brand;
  public recaptchaResponse = '';
  public captchaErrorMsg = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private titleService: Title,
    private aas: AppAuthService,
    private us: UserService,
    private dialog: MatDialog,
    private translate: TranslateService,
    public zone: NgZone,
    private snackbar: MySnackBarSevice,
  ) { }

  public ngOnInit() {
    this.titleService.setTitle(Brand.title + ' | Login');

    /* This is actually not needed, but is a good way of checking if API is working */
    this.aas.doAuth((response, error) => {
      if (error) {
        this.errorMessage = 'There has been an error, please try again later.';
      } else {
        this.gotToken = true;
        // Is enviroment.beta is set, show the dialog to accept the terms
        if ('beta' in environment && environment.beta && !this.acceptedBetaTerms) {
          this.openBetaTerms();
        } else { this.acceptedBetaTerms = true; }
      }
      // this.addCaptchaScript();
    });
  }

  public retry() {
    window.location.reload();
  }

  // Event for when we get the captcha confirmation
  public gotCaptcha(evt) {
    this.zone.run(() => {
      this.recaptchaResponse = evt;
      this.credentials.username = this.credentials.username;
    });
  }

  public capthaError(evt) {
    this.errorMessage = 'There has been an error with the reCAPTCHA, please try again later.';
  }

  // Does login
  public doLogin(event) {
    if (this.validFields()) {
      this.loading = true;
      this.disabled = true;

      // Do login
      const sub = this.loginService.login(
        this.credentials.username, this.credentials.password, this.credentials.two_fa,
      );

      sub.subscribe((token) => {
        const tokens: any = JSON.parse(JSON.stringify(token));
        tokens.created = new Date();

        const loginDate = Date.now().toString();

        this.us.tokens = tokens;
        localStorage.setItem('user.tokens', JSON.stringify(tokens));
        localStorage.setItem('session_status', 'active');
        localStorage.setItem('login_date', loginDate);

        this.us.getProfile()
          .subscribe(
            (resp) => {
              console.log('Get profile Good');
              this.us.setData(resp);

              if (!this.us.isSuperAdmin()) {
                this.us.logout();
                this.disabled = false;
                this.loading = false;
                this.snackbar.open('You don\'t have necesary permissions...', 'OK');
                return;
              }

              setTimeout(async (x) => {
                // If its all accepted we proceed to login
                console.log('dataProtectionAccepted && tosAccepted');

                // reset tokens as they have accepted and they can login now
                this.us.tokens = tokens;
                localStorage.setItem('user.tokens', JSON.stringify(tokens));
                localStorage.setItem('session_status', 'active');
                localStorage.setItem('login_date', loginDate);

                const onFinishLogin = () => {
                  // Emit the login event, so actions that need to be done after login can be done
                  this.loginService.onLogin.emit(true);
                  console.log('Login completed');
                };

                // Now user can navigate to app
                console.log('!this.us.needChangePassword');
                this.router.navigate(['/dashboard']);
                onFinishLogin();
              }, 10);
              this.loginService.isLoggedIn_ = true;
            },
            (error) => {
              console.log('Get profile bad', error);
              this.errorMessage = error._body ? error._body.error_description : 'error';
              this.loading = false;
              this.disabled = false;
              this.us.tokens = null;
              localStorage.removeItem('user.tokens');
              localStorage.removeItem('session_status');
              localStorage.removeItem('login_date');
            });
      }, (error) => {
        console.log('Loggin bad', error);
        this.errorMessage = error._body ? error._body.error_description : 'error';
        this.loading = false;
        this.disabled = false;
      });
    } else { this.errorMessage = 'Please, username and password are required'; }
  }

  public openDevOptions() {
    let ref = this.dialog.open(DevOptions);
    ref.afterClosed().subscribe(
      (resp) => ref = null,
    );
  }

  public openBetaTerms() {
    const ref = this.dialog.open(BetaTerms, { disableClose: true });
    ref.afterClosed().subscribe(
      (resp) => {
        if (resp === 'accepted') { this.acceptedBetaTerms = true; }
      },
    );
  }

  public async openDataProtection(dataProtectionAccepted, tosAccepted, notifAccepted): Promise<any> {
    const ref = this.dialog.open(DataProtection, { disableClose: true });
    ref.componentInstance.dataProtectionAccepted = dataProtectionAccepted;
    ref.componentInstance.tosAccepted = tosAccepted;
    ref.componentInstance.notifAccepted = notifAccepted;
    return await ref.afterClosed()
      .toPromise()
      .then((confirmed) => confirmed)
      .catch((error) => { return; });
  }

  public async openChangePassword(message?: string, disable = false) {
    const dialogRef = this.dialog.open(ChangePassword, { disableClose: disable });
    dialogRef.componentInstance.message = message;
    await dialogRef.afterClosed().toPromise().then().catch();
  }

  private addCaptchaScript() {
    const script = document.createElement('script');
    const lang = this.translate.getBrowserLang();
    const langParams = '&hl=' + lang;
    script.src = `https://www.google.com/recaptcha/api.js?render=onload${langParams}`;
    script.async = true;
    script.defer = true;
    (window as any).gotCaptcha = (x) => {
      this.gotCaptcha(x);
    };
    (window as any).captchaError = (x) => {
      this.capthaError(x);
    };
    document.body.appendChild(script);
  }

  // Check if fields are correct
  private validFields(): boolean {
    if (
      !this.credentials.username ||
      !this.credentials.password
    ) { return false; }
    return true;
  }
}
