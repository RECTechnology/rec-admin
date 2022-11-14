import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoginService, AppAuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user.service';
import { environment } from '../../environments/environment';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AppService } from 'src/services/app/app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'login',
  styleUrls: ['./login.css'],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit {
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
  public Brand: any = environment.Brand;
  public apiVersion = '...';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private titleService: Title,
    private aas: AppAuthService,
    private us: UserService,
    public zone: NgZone,
    public alerts: AlertsService,
    public app: AppService,
    public translate: TranslateService,
  ) {}

  public ngOnInit() {
    /* This is actually not needed, but is a good way of checking if API is working */
    this.aas.doAuth().subscribe(
      (resp) => {
        return;
      },
      (error) => {
        if (error) {
          this.errorMessage = 'There has been an error, please try again later.';
        } else {
          this.gotToken = true;
        }
      },
    );

    this.app.getInfo().subscribe((resp) => (this.apiVersion = resp.data.version));
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.titleService.setTitle(this.translate.instant(this.Brand.title) + ' | Login');
    }, 500);
  }

  public retry() {
    window.location.reload();
  }

  // Does login
  public doLogin() {
    if (this.validFields()) {
      this.loading = true;
      this.disabled = true;

      // Do login
      const sub = this.loginService.login(
        this.credentials.username,
        this.credentials.password,
        this.credentials.two_fa,
      );

      sub.subscribe(
        (token) => {
          const tokens: any = JSON.parse(JSON.stringify(token));
          tokens.created = new Date();

          const loginDate = Date.now().toString();

          this.us.tokens = tokens;
          localStorage.setItem('user.tokens', JSON.stringify(tokens));
          localStorage.setItem('session_status', 'active');
          localStorage.setItem('login_date', loginDate);

          this.us.getProfile().subscribe(
            (resp) => {
              this.us.setData(resp);

              if (!this.us.isSuperAdmin()) {
                this.us.logout();
                this.disabled = false;
                this.loading = false;
                this.alerts.showSnackbar('NOT_NECESSARI_PERMISSIONS', 'OK');
                return;
              }

              setTimeout(async (x) => {
                // reset tokens as they have accepted and they can login now
                this.us.tokens = tokens;
                localStorage.setItem('user.tokens', JSON.stringify(tokens));
                localStorage.setItem('session_status', 'active');
                localStorage.setItem('login_date', loginDate);

                // Now user can navigate to app
                this.router.navigate(['/dashboard']);
                this.loginService.onLogin.emit(true);
              }, 10);
              this.loginService.isLoggedIn_ = true;
            },
            (error) => {
              this.errorMessage = error ? error.error_description : 'error';
              this.loading = false;
              this.disabled = false;
              this.us.tokens = null;
              localStorage.removeItem('user.tokens');
              localStorage.removeItem('session_status');
              localStorage.removeItem('login_date');
            },
          );
        },
        (error) => {
          this.errorMessage = error ? error.error_description : 'error';
          this.loading = false;
          this.disabled = false;
        },
      );
    } else {
      this.errorMessage = 'Please, username and password are required';
    }
  }

  // Check if fields are correct
  private validFields(): boolean {
    if (!this.credentials.username || !this.credentials.password) {
      return false;
    }
    return true;
  }
}
