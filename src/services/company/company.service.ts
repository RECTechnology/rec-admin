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
  public selectedCompany: any = {};
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
    this.ls.onLogin.subscribe(
      (resp) => {
        this.doGetCompanies();
      },
    );
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

  public findCompany(comp_id) {
    const cmp = this.companies.filter((el) => {
      return el.id === comp_id;
    });
    return cmp.length ? cmp[0] : undefined;
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
    return this.get(null, {}, `${API_URL}/company/${id}/v1/wallet/transactions`);
  }

  /**
   * Gets companies and selects company
   *   - If `selectedAccount` is set it will use that as the default account
   *   - If not it will select the default account
   * @return {Observable}
   */
  public doGetCompanies() {
    this.getCompanies()
      .subscribe(
        (resp) => {
          this.companies = resp.data.elements;
          const selectedAccount = localStorage.getItem('selected_account');
          this.selectCompany(selectedAccount ? { id: selectedAccount } : this.us.userData.group_data);
        }, (error) => { this.companies = []; });
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

  public getMapList(only_offers?, retailer?, wholesale?) {
    const data = {
      only_offers,
      retailer,
      wholesale,
    };
    return this.get(null, { data }, `${API_URL}/map/v1/list`);
  }

  /**
   * @param {String} account_id - the group from where to get user
   * @return {Observable}
   */
  public getGroupUsers(account_id: string, offset = 0, limit = 10): Observable<any> {
    return this.get(null, { offset, limit }, `${API_URL}/manager/v1/usersbygroup/${account_id}`);
  }

  /**
   * @param {String} src      - The source URI of the image
   * @param {String} group_id - the group to update image
   * @return {Observable}
   */
  public updateImage(src: string, group_id: string): Observable<any> {
    return this.put({ company_image: src }, null,
      `${API_URL}/company/v1/account/${group_id}/image`,
      'application/x-www-form-urlencoded',
    );
  }

  /**
   * @param {String} user_id - The user id to update role
   * @param {String} role    - The new role
   * @return {Observable}
   */
  public updateUserRole(user_id: string, role: string): Observable<any> {
    return this.post({ role }, null,
      `${API_URL}/manager/v1/groupsrole/${this.us.getGroupId()}/${user_id}`,
      'application/x-www-form-urlencoded',
    );
  }

  /**
   * @param {String} url         - The urls of the KYC file
   * @param {Number} tier        - The tier level
   * @param {String} description - A description
   * @return {Observable}
   */
  public uploadKycFile(url: string, tier: number, description: string): Observable<any> {
    return this.post({
      description,
      tier,
      url,
    }, null, `${API_URL}/company/v1/account/kyc/upload`, 'application/x-www-form-urlencoded');
  }

  /**
   * @return {Observable}
   */
  public getKycUploads() {
    return this.get(null, null, `${API_URL}/company/v1/account/kyc/upload`);
  }

  /**
   * @param {Number} tier - The tier level
   * @return {Observable}
   */
  public requestKycValidation(tier: number) {
    return this.put({ tier }, null,
      `${API_URL}/company/v1/account/kyc/validation`, 'application/x-www-form-urlencoded');
  }

  /**
   * @param {String} group_id - The group to set as active/default
   * @return {Observable}
   */
  public setActiveGroup(group_id: string): Observable<any> {
    return this.put({ group_id }, null, `${API_URL}/user/v1/activegroup`, 'application/x-www-form-urlencoded');
  }

  /**
   * @param {String} group_id - The group id
   * @return {Observable}
   */
  public getGroup(group_id: string): Observable<any> {
    return this.get(null, null, `${API_URL}/groups/v1/show/${group_id}`)
      .pipe(
        map((resp) => {
          return this.mapCompany(resp);
        }),
      );
  }

  public getAccount(account_id: string): Observable<any> {
    return this.get(null, null, `${API_URL}/admin/v3/accounts/${account_id}`)
      .pipe(
        map((resp) => {
          return this.mapCompany(resp.data);
        }),
      );
  }

  /**
   * @param {String} group_id - The group id
   * @return {Observable}
   */
  public getGroupUsersManager(group_id: string): Observable<any> {
    return this.get(null, null, `${API_URL}/manager/v1/company/${group_id}/users`);
  }

  public listCategories() {
    // /company/v1/list_categories
    return this.get(null, null, `${API_URL}/company/v1/list_categories`);
  }

  public saveCompanyImages(account_id, company_image, public_image) {
    const obj = {
      company_image, public_image,
    };
    return this.put(obj, null, `${API_URL}/manager/v1/groups/${account_id}/image`);
  }

  /**
   * @param {Object} company
   *    - The company to be used to view and manage
   *    - It will get the account data also
   */
  public selectCompany(company: any, showChangingAccount = false): Observable<any> {
    return new Observable((observer) => {
      if (this.us.userData.group_data.id !== company.id) {
        if (showChangingAccount) {
          this.changingFrom = company;
          this.changingTo = this.us.userData.group_data;
          this.changingAccount = true;
        }
        this.setActiveGroup(company.id)
          .subscribe(
            (resp) => {
              localStorage.setItem('selected_account', company.id);

              observer.next();
              observer.complete();

              this.getAccount(company.id)
                .subscribe(
                  (data) => {
                    this.us.userData.group_data = data.data.elements;
                    this.us.userData.group_data.wallets[0].available =
                      this.us.userData.group_data.wallets[0].available / 100000000;
                    this.us.userData.group_data.wallets[0].balance =
                      this.us.userData.group_data.wallets[0].balance / 100000000;

                    this.us.isReseller = this.us.userData.group_data.roles.includes('ROLE_RESELLER');
                    this.changingAccount = false;
                  },
                  (error) => this.changingAccount = false);
            }, (error) => {
              this.changingAccount = false;
              if (error.status === 403) {
                observer.error({ status: 403, error: 'You dont have the necesary permissions' });
                this.alerts.showSnackbar('You dont have the necesary permissions', 'ok');
              } else {
                observer.error({ status: 0, error: 'There has been an error: ' + error.message });
                this.alerts.showSnackbar('There has been an error: ' + error.message, 'ok');
              }
            });
      }
    });
  }
}
