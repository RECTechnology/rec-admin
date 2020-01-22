import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { UserService } from '../user.service';
import { API_URL } from '../../data/consts';
import { LoginService } from '../auth/auth.service';
import { WalletService } from '../wallet/wallet.service';
import { UtilsService } from '../utils/utils.service';
import { map } from 'rxjs/internal/operators/map';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertsService } from '../alerts/alerts.service';
import { Account } from 'src/shared/entities/account.ent';

interface Category {
  cat: string;
  eng: string;
  esp: string;
  id: number;
}

@Injectable()
export class CompanyService extends BaseService {
  public id = '';
  public settings: any = [];
  public currencies: any[] = [];
  public scheduled: any[] = [];
  public total_schedules: number = 0;
  public totalUsers: number = 0;
  public selectedCompany: Account = null;
  public companies: any[] = [];
  public companyUsers: any[] = [];
  public changingAccount = false;
  public changingFrom: any = {};
  public changingTo: any = {};
  public totalAccounts = 0;
  public categories: Category[];

  constructor(
    http: HttpClient,
    public us: UserService,
    public ls: LoginService,
    private ws: WalletService,
    private utils: UtilsService,
    public alerts: AlertsService,
  ) {
    super(http, us);
  }

  public mapCompany(el) {
    const updated: any = {};
    updated.available = el && el.wallets && el.wallets[0] ? this.ws.scaleNum(el.wallets[0].available, 8) : 0;
    updated.available_eur = el && el.wallets && el.wallets[1] ? this.ws.scaleNum(el.wallets[1].available, 2) : 0;
    updated.scheduleMap = this.utils.parseSchedule(el.schedule);
    updated.polla = 'asdas';
    return {
      ...el,
      ...updated,
    };
  }

  public getCompanies(
    offset = 0, limit = 10,
    query = null, sort = 'id',
    order = 'desc',
    active: boolean | number = true, type = null,
  ) {
    return this.get(null, { offset, limit, search: query, order, sort, active, type }, `${API_URL}/manager/v2/groups`)
      .pipe(map((resp) => {
        resp.data.elements = resp.data.elements.map(this.mapCompany.bind(this));
        return resp;
      }));
  }

  public getTxForAccount(id) {
    console.warn('DEPRECATED: CompanyService.getTxForAccount is deprecated');
    return this.get(null, {}, `${API_URL}/company/${id}/v1/wallet/transactions`);
  }

  public setCategory(categoryId, accountId) {
    return this.put({
      account_id: accountId,
    }, null, `${API_URL}/company/v1/category?category=${categoryId}`);
  }

  public removeUserFromSystem(id) {
    return this.delete(null, `${API_URL}/manager/v1/users/${id}`);
  }

  public getAllUsers(query, offset = 0, limit = 10, sort = 'id', order = 'desc') {
    return this.get(null, { search: query, offset, limit, sort, order }, `${API_URL}/manager/v2/users`).pipe(
      map((resp) => {
        resp.data.elements.map(async (u) => {
          const comps = await this.getCompaniesForUser(u.id).toPromise().then((comp) => comp.data);
          u.companies = comps.elements;
          u.roles = comps.roles;
          return u;
        });
        return resp;
      }));
  }

  public getCompaniesForUser(id) {
    return this.get(null, {}, `${API_URL}/manager/v1/groupsbyuser/${id}`);
  }

  public updateUserImages(id, data) {
    return this.put(data, null, `${API_URL}/user/v2/image`);
  }

  public getGroupUsers(account_id: string, offset = 0, limit = 10): Observable<any> {
    console.warn('DEPRECATED: CompanyService.getGroupUsers is deprecated');
    return this.get(null, { offset, limit }, `${API_URL}/manager/v1/usersbygroup/${account_id}`);
  }

  public updateUserRole(user_id: string, role: string): Observable<any> {
    return this.post({ role }, null,
      `${API_URL}/manager/v1/groupsrole/${this.us.getGroupId()}/${user_id}`,
      'application/x-www-form-urlencoded',
    );
  }

  public getUserAccounts() {
    return this.get(null, null, `${API_URL}/user/v1/companies`);
  }

  public setActiveGroup(group_id: string): Observable<any> {
    return this.put({ group_id }, null, `${API_URL}/user/v1/activegroup`, 'application/x-www-form-urlencoded');
  }

  public getAccount(account_id: string): Observable<any> {
    return this.get(null, null, `${API_URL}/admin/v3/accounts/${account_id}`)
      .pipe(
        map((resp) => new Account(resp.data)),
      );
  }
}
