import { Injectable } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { API_URL, clientID, clientSecret } from '../../data/consts';
import { BaseService } from '../base/base.service';
import { UserStorage } from '../user-storage/user-storage';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertsService } from '../alerts/alerts.service';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observer } from 'rxjs/internal/types';
import { retryPipeline } from 'src/shared/rxjs-pipelines';

@Injectable()
export class AppAuthService extends BaseService {
  public app_tokens: any = {};
  public clientID = clientID;
  public clientSecret = clientSecret;
  public user_tokens;
  public authSub: any;
  public lcSub: any;

  constructor(
    http: HttpClient,
    us: UserService,
  ) {
    super(http, us);
  }

  public AppToken(): Observable<string> {
    return this.http.post(
      `${API_URL}/oauth/v2/token`,
      { client_id: clientID, client_secret: clientSecret, grant_type: 'client_credentials', version: 1 },
      ({
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'content-type': 'application/json',
        }),
      }),
    ).pipe(
      retryPipeline,
      map(this.extractData),
      catchError(this.handleError.bind(this)),
    );
  }

  public refreshToken(refresh_token): Observable<any> {
    return this.get(
      null, {
      client_id: clientID,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token,
    }, `${API_URL}/oauth/v2/token`,
    );
  }

  public doAuth() {
    return this.AppToken();
  }
}

@Injectable()
export class LoginService extends BaseService {
  // tslint:disable-next-line: variable-name
  public isLoggedIn_: any = false;
  // tslint:disable-next-line: variable-name
  public loginObserver_: Observer<any>;
  public tokens: any = null;
  public app_tokens: any = null;
  public accounts: Observable<any>;
  public tokenTimeout2;

  @Output() public onLogin: EventEmitter<any> = new EventEmitter();
  @Output() public onLogout: EventEmitter<any> = new EventEmitter();

  public isLoggedIn: Observable<any> = new Observable(this.loginObserver.bind(this));
  private tokenTimeout = null;

  constructor(
    http: HttpClient,
    public router: Router,
    public us: UserService,
    public appAuthServ: AppAuthService,
    private dialog: MatDialog,
    public alerts: AlertsService,
  ) {
    super(http, us);
    this.us.onLogout.subscribe(() => this.logout());
  }

  public login(username, password, pin?): Observable<any> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const options = ({ headers });
    return this.http.post(
      `${API_URL}/oauth/v3/token`,
      {
        client_id: clientID,
        client_secret: clientSecret,
        grant_type: 'password',
        password,
        pin,
        username: username.trim(),
        version: '1',
      },
      options,
    );
  }

  public logout() {
    this.tokens = {};
    const currentStorage = JSON.parse(JSON.stringify(localStorage));
    const groupData = this.us.userData.group_data || {};

    const data = {
      'current-version': currentStorage['current-version'],
      'first-time-use': currentStorage['first-time-use'],
      'lang': currentStorage.lang,
      'last_session_data': currentStorage.last_session_data,
      'session_status': currentStorage.session_status,
      'showZeroBalances': currentStorage.showZeroBalances,
      'user-favs': currentStorage['user-favs'],
      'wallet_balance': currentStorage.wallet_balance,
    };

    const savedConfigs = {
      lang: currentStorage.lang,
    };

    for (const key in currentStorage) {
      if (key.indexOf('ticker') !== -1) {
        data[key] = currentStorage[key];
      } else if (key.indexOf('___USR___') !== -1) {
        savedConfigs[key] = currentStorage[key];
      }
    }

    localStorage.clear();

    for (const cfig in savedConfigs) {
      if (cfig) {
        localStorage.setItem(cfig, savedConfigs[cfig]);
      }
    }

    this.us.userData = {};
    UserStorage.save(groupData.access_key, data, groupData.access_secret);
    UserStorage.hasLoadedYet = false;
    this.isLoggedIn_ = false;

    this.dialog.closeAll();
    this.onLogout.emit(true);
    this.router.navigate(['/']);
  }

  public isSessionExpired() {
    const expiredOffset = 6e5;
    const now = Date.now();
    const savedSessDate = +(localStorage.getItem('last_session_date'));
    const lastSessionDate: any = new Date(((savedSessDate || now) + expiredOffset) / 1000).getTime();
    const dateNow = now / 1000;
    return lastSessionDate && lastSessionDate < dateNow;
  }

  private loginObserver(observer) {
    this.loginObserver_ = observer;
    this.tokens = JSON.parse(localStorage.getItem('user.tokens'));
    this.app_tokens = JSON.parse(localStorage.getItem('app.tokens'));
    this.us.tokens = this.tokens;

    if (this.tokens) {
      const expires = this.tokens.expires_in;
      const tokenDate = new Date(this.tokens.created).getTime();
      const expiresDate = new Date(tokenDate + ((expires - 200) * 1000)).getTime();
      const nowDate = new Date().getTime();
      const isExpired = nowDate >= expiresDate;

      const timeoutTime = (expiresDate - nowDate);
      if (timeoutTime > 1000) {
        clearInterval(this.tokenTimeout);
        this.tokenTimeout = setInterval(((_) => {
          clearInterval(this.tokenTimeout);
          setTimeout((() => {
            this.tokenTimeout = null;
            this.isLoggedIn.subscribe((logged) => { return; }, (err) => { return; });
          }).bind(this), 2000);
        }).bind(this), timeoutTime);
      }

      if (isExpired) {
        if (this.tokens.refresh_token && !this.isSessionExpired()) {
          this.refresh(observer);
        } else {
          this.isLoggedIn_ = false;
          this.logout();
          observer.error('error');
        }
      } else {
        if (!this.us.userData.id) {
          this.us.getProfile()
            .subscribe(
              (resp) => {
                this.us.userData = resp;
                this.isLoggedIn_ = true;
                this.onLogin.emit(true);
                observer.next(true);
              },
              (error) => {
                if (error.error_description === 'User account is locked.') {
                  this.isLoggedIn_ = false;
                  observer.error('error');
                  this.alerts.showSnackbar('User account is locked.', 'ok');
                } else if (this.tokens.refresh_token) {
                  this.refresh(observer);
                } else {
                  this.isLoggedIn_ = false;
                  observer.error('error');
                }
              });
          this.isLoggedIn_ = true;
        } else {
          observer.next(true);
          this.isLoggedIn_ = true;
        }
      }
    } else {
      this.isLoggedIn_ = false;
      observer.next(false);
    }
  }

  private refresh(observer?) {
    this.appAuthServ.refreshToken(this.tokens.refresh_token)
      .subscribe(
        (resp) => {
          this.us.tokens = this.tokens = resp;
          resp.created = new Date();
          localStorage.setItem('user.tokens', JSON.stringify(resp));

          clearInterval(this.tokenTimeout);

          this.tokenTimeout = setInterval(((_) => {
            clearInterval(this.tokenTimeout);
            this.tokenTimeout = null;
            this.isLoggedIn.subscribe((logged) => { return; }, (err) => { return; });
          }).bind(this), 3200 * 1000);

          this.us.getProfile()
            .subscribe(
              (profile) => {
                this.us.userData = profile;
                this.isLoggedIn_ = true;
                this.us.isAdmin = this.us.userData.roles ? (this.us.userData.roles[0] === 'ROLE_ADMIN') : false;
                observer.next(true);
                observer.complete();
              },
              (error) => {
                this.isLoggedIn_ = false;
                this.logout();
              },
            );
        },
        (error) => {
          this.isLoggedIn_ = false;
          if (error.status !== 0) {
            this.logout();
          } else {
            setTimeout(((_) => this.refresh(observer)).bind(this), 3000);
          }
        },
      );
  }
}
