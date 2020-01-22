import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from '../user.service';
import { LoginService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  public tokens: any = {};
  constructor(
    private router: Router,
    private ls: LoginService,
    private us: UserService,
  ) { }

  public canActivate(): Observable<any> {
    return new Observable((observer) => {
      if (this.ls.isSessionExpired()) {
        this.ls.logout();
        observer.next(false);
        observer.complete();
      } else {
        this.ls.isLoggedIn.subscribe(
          (resp) => {
            if (!resp) {
              this.ls.logout();
              observer.next(false);
              observer.complete();
            } else {
              localStorage.setItem('login_date', Date.now().toString());
              this.ls.onLogin.emit(true);
              observer.next(true);
              observer.complete();
            }
          },
          (error) => {
            this.ls.logout();
            observer.next(false);
            observer.complete();
          },
        );
      }
    });
  }
}

@Injectable()
export class IsNotLoggedInGuard implements CanActivate {
  public tokens: any = {};
  constructor(
    private router: Router,
    private ls: LoginService,
    private us: UserService,
  ) { }

  public canActivate(): Observable<any> {
    return new Observable((observer) => {
      if (this.ls.isSessionExpired()) {
        observer.next(true);
        observer.complete();
      }
      this.ls.isLoggedIn.subscribe(
        (resp) => {
          if (!resp) {
            observer.next(true);
            observer.complete();
          } else {
            this.router.navigate(['/dashboard']);
            observer.next(false);
            observer.complete();
          }
        },
        (error) => {
          observer.next(true);
          observer.complete();
        },
      );
    });
  }
}

@Injectable()
export class IsAdminInGuard implements CanActivate {
  public tokens: any = {};
  constructor(
    private router: Router,
    private ls: LoginService,
    private us: UserService,
  ) { }

  public canActivate(): Observable<any> {
    return new Observable((observer) => {
      this.ls.isLoggedIn.subscribe(
        (resp) => {
          if (this.us.userData.roles[0] === 'ROLE_ADMIN') {
            observer.next(true);
            observer.complete();
          } else {
            this.router.navigate(['/dashboard']);
            observer.next(false);
            observer.complete();
          }
        },
        (error) => {
          this.router.navigate(['/login']);
          observer.next(false);
          observer.complete();
        },
      );
    });
  }
}
