import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { UserService } from '../user.service';
import { ErrorManager } from '../error-manager/error-manager';
import { LoginService } from '../auth.service';
import { NotificationService } from '../notifications/notifications.service';
import { CompanyService } from '../company/company.service';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../data/consts';

@Injectable()
export class B2bService extends BaseService {
  constructor(
    http: HttpClient,
    public us: UserService,
    public errMan: ErrorManager,
    public ls: LoginService,
    public ns: NotificationService,
    public cs: CompanyService,
  ) {
    super(http, us, errMan);
  }

  public getNeighborhoods() {
    return this.get(null, null, `${API_URL}/b2b/neighborhoods`);
  }

  public getProducts() {
    return this.get(null, null, `${API_URL}/b2b/products`);
  }

  public getActivities() {
    return this.get(null, null, `${API_URL}/b2b/activities`);
  }

  public editNeighborhood(id, data) {
    return this.put(data, null, `${API_URL}/b2b/neighborhoods/${id}`);
  }

  public editProducts(id, data) {
    return this.put(data, null, `${API_URL}/b2b/products/${id}`);
  }

  public editActivities(id, data) {
    return this.put(data, null, `${API_URL}/b2b/activities/${id}`);
  }
}
