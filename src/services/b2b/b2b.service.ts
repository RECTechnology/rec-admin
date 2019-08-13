
import { Injectable } from '@angular/core';
import { BaseService2 } from '../base/base.service-v2';
import { UserService } from '../user.service';
import { LoginService } from '../auth/auth.service';
import { NotificationService } from '../notifications/notifications.service';
import { CompanyService } from '../company/company.service';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../data/consts';

@Injectable()
export class B2bService extends BaseService2 {
  constructor(
    http: HttpClient,
    public us: UserService,
    public ls: LoginService,
    public ns: NotificationService,
    public cs: CompanyService,
  ) {
    super(http, us);
    this.setFlag('translateHeaders', true);
  }

  public getNeighborhoods() {
    return this.get(`/admin/neighborhoods`);
  }

  public getProducts() {
    return this.get(`/admin/products`);
  }

  public getActivities() {
    return this.get(`/admin/activities`);
  }

  public editNeighborhood(id, data) {
    return this.put(`/admin/neighborhoods/${id}`, data);
  }

  public editProducts(id, data) {
    return this.put(`/admin/products/${id}`, data);
  }

  public editActivities(id, data) {
    return this.put(`/admin/activities/${id}`, data);
  }

  public addNeighborhood(data) {
    return this.post(`/admin/neighborhoods`, data);
  }

  public addProducts(data) {
    return this.post(`/admin/products`, data);
  }

  public addActivities(data) {
    return this.post(`/admin/activities`, data);
  }
}
