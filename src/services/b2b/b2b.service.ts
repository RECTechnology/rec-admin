
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

  public sendB2BMailAccount() {
    return this.post('/b2b/account-mail', {});
  }

  public sendB2BMailBulk() {
    return this.post('/b2b/bulk-mail', {});
  }
}
