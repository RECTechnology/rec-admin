import { BaseComponent } from './base-component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterContentInit, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { LoginService } from '../services/auth.service';

export interface PageBase {

  route?: ActivatedRoute;
  router?: Router;
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

export abstract class PageBase extends BaseComponent implements AfterContentInit, OnInit {

  public abstract titleService: Title;
  public abstract pageName: string;
  public abstract ls: LoginService;
  public Brand: any = environment.Brand;

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

  public setTitle(title): void {
    this.titleService.setTitle(title);
  }

  public getTitle(): string {
    return this.titleService.getTitle();
  }
}

export interface OnLogin {
  onLogin(resp: any): void;
}

export interface OnLogout {
  onLogout(): void;
}
