import { BaseComponent } from './base-component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterContentInit, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { LoginService } from '../services/auth/auth.service';
import { Sort } from '@angular/material';

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

export abstract class PageBase extends BaseComponent implements AfterContentInit, OnInit, PageBase {

  public abstract titleService: Title;
  public abstract pageName: string;
  public abstract ls: LoginService;
  public Brand: any = environment.Brand;
  public loading = false;

  constructor() {
    super();
    this.loading = true;
  }

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

  public getTitle(): string {
    return this.titleService.getTitle();
  }
}

export abstract class TablePageBase extends PageBase {
  public sortID: string = 'id';
  public sortDir: string = 'desc';
  public query: string = '';
  public offset: number = 0;
  public limit: number = 10;
  public total = 0;
  public showing = 0;

  public data: any[] = [];
  public sortedData: any[] = [];

  public abstract search(): any;

  public changedPage($event) {
    this.limit = $event.pageSize;
    this.offset = this.limit * ($event.pageIndex);
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
    this.search();
  }
}

export interface OnLogin {
  onLogin(resp: any): void;
}

export interface OnLogout {
  onLogout(): void;
}
