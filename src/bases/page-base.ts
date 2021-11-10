import { AlertsService } from 'src/services/alerts/alerts.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { BaseComponent } from './base-component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { LoginService } from '../services/auth/auth.service';
import { Sort } from '@angular/material/sort';
import { UtilsService } from 'src/services/utils/utils.service';

export interface PageBase {
  route?: ActivatedRoute;
  router?: Router;

  sortID: string;
  sortDir: string;
  query: string;
  limit: number;
  offset: number;
  total: number;
  showing: number;

  loading: boolean;

  /**
   * @method afterContentInit
   * Optional method to execute after page's ngAfterContentInit
   */
  afterContentInit?(): void;

  /**
   * @method onInit
   * Optional method to execute after page's ngOnInit
   */
  onInit?(): void;

  /**
   * @method ngOnLogout
   * Will be called once all other logout logic is finished
   */
  onLogout?(): void;

  /**
   * @method onLogin
   * Will be called once user has logged in
   */
  onLogin?(resp: any): void;
}

@Component({
  template: '',
})
export abstract class PageBase extends BaseComponent implements AfterContentInit, OnInit, PageBase {
  public abstract titleService: Title;
  public abstract pageName: string;
  public abstract ls: LoginService;
  public Brand: any = environment.Brand;
  public loading = true;
  public validationErrors = [];
  public validationErrorName = '';

  public alerts: AlertsService;

  public ngOnInit() {
    if (typeof this.onLogout === 'function') {
      this.ls.onLogout.subscribe((_) => this.onLogout());
    }
    if (typeof this.onLogin === 'function') {
      this.ls.onLogin.subscribe((_) => this.onLogin(_));
    }
    if (typeof this.onInit === 'function') {
      this.onInit();
    }
  }

  public ngAfterContentInit() {
    if (typeof this.afterContentInit === 'function') {
      this.afterContentInit();
    }

    this.loading = false;
    this.setTitle(this.Brand.title + ' | ' + this.pageName);
  }

  public setTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  public setTitleParts(title: string[]): void {
    // this.titleService.setTitle(title.map((el) => this.translate.instant(el)).join(' '));
  }

  public getTitle(): string {
    return this.titleService.getTitle();
  }

  public handleValidationError(error) {
    this.validationErrors = error.data;
    return UtilsService.handleValidationError(this, error);
  }
}

@Component({
  template: '',
})
export abstract class TablePageBase extends PageBase {
  public sortID: string = 'id';
  public sortDir: string = 'desc';
  public query: string = '';
  public offset: number = 0;
  public limit: number = 10;
  public total = 0;
  public showing = 0;
  public autoRefresh = false;
  public autoRefreshInterval = 60e3;
  public refreshInterval = null;

  public data: any[] = [];
  public sortedData: any[] = [];

  public searchObs: Subscription;

  public abstract search(query?: string): any;

  constructor(public router: Router) {
    super();
  }

  // Searches and cancels previous Observable if there is one
  public searchWrapper(query: string = this.query) {
    if (this.searchObs) {
      this.searchObs.unsubscribe();
      this.searchObs = null;
    }

    this.search(query);
  }

  public ngOnInit() {
    clearInterval(this.refreshInterval);
    if (this.autoRefresh) {
      this.refreshInterval = setInterval(this.search.bind(this), this.refreshInterval);
    }
  }

  public ngOnDestroy() {
    clearInterval(this.refreshInterval);
  }

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = $event.pageIndex * this.limit;

    console.log('changed page', this.offset, this.limit);

    this.addToQueryParams({
      limit: this.limit,
      offset: this.offset,
    });
    this.search();
  }

  public sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.sortedData = this.data.slice();
      this.sortID = 'id';
      this.sortDir = 'desc';
    } else {
      this.sortID = sort.active;
      this.sortDir = sort.direction;
    }
    this.addToQueryParams({
      sortId: this.sortID,
      sortDir: this.sortDir,
    });
    this.search();
  }

  public addToQueryParams(data: Params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: data,
      queryParamsHandling: 'merge',
    });
  }
}

export interface OnLogin {
  onLogin(resp: any): void;
}

export interface OnLogout {
  onLogout(): void;
}
