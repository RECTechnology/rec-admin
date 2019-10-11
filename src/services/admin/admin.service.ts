import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { UserService } from '../user.service';
import { LoginService } from '../auth/auth.service';
import { API_URL } from '../../data/consts';
import { NotificationService } from '../notifications/notifications.service';
import { SearchAccountsParams, ListAccountsParams } from '../../interfaces/search';
import { CompanyService } from '../company/company.service';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AdminService extends BaseService {
    constructor(
        http: HttpClient,
        public us: UserService,
        public ls: LoginService,
        public ns: NotificationService,
        public cs: CompanyService,
    ) {
        super(http, us);
    }

    public checkWithdrawals() {
        const needsToVote = this.checkIfUserNeedsToVote(this.us.userData);
        if (needsToVote) {
            this.ns.addNotification({
                description: 'There is a withdrawal awaiting you to vote',
                icon: 'vote-yea',
                id: 'Withdrawal vote awaiting',
                link: '/treasure_account',
                title: 'Withdrawal vote awaiting',
            });
        }
    }

    public checkIfUserNeedsToVote(user = null) {
        return user.treasure_validations.length > 0;
    }

    public getWithdrawals() {
        return this.get(null, null, `${API_URL}/admin/v1/treasure_withdrawals`);
    }

    public addWithdrawal(data) {
        return this.post(data, null, `${API_URL}/admin/v1/treasure_withdrawals`);
    }

    public getWithdrawal(id) {
        return this.get(null, null, `${API_URL}/admin/v1/treasure_withdrawals/${id}`);
    }

    public createWithdrawal(data) {
        return this.post(data, null, `${API_URL}/admin/v1/treasure_withdrawals`);
    }

    public getWithdrawalValidations() {
        return this.get(null, null, `${API_URL}/admin/v1/treasure_withdrawal_validations`);
    }

    public validateWithdrawalAttempt(id, data) {
        return this.put(data, null, `${API_URL}/admin/v1/treasure_withdrawal_validations/${id}`);
    }

    public deactiveUser(id_user) {
        return this.post({}, null, `${API_URL}/admin/v1/deactiveuser/${id_user}`);
    }

    public activeUser(id_user) {
        return this.post({}, null, `${API_URL}/admin/v1/activeuser/${id_user}`);
    }

    /**
     * @param {String} group_id - the group to delete user from
     * @param {String} user_id - the user to delete
     * @return {Observable}
     */
    public removeUserFromAccount(group_id: string, user_id: string): Observable<any> {
        return this.delete(null, `${API_URL}/admin/v2/groups/${group_id}/${user_id}`);
    }

    public updateUser(id, data) {
        return this.put(data, null, `${API_URL}/admin/v3/users/${id}`);
    }

    public updateUserKyc(id, data) {
        return this.put(data, null, `${API_URL}/admin/v3/kycs/${id}`);
    }

    public updateUserPhone(id, prefix, phone) {
        return this.put({ prefix, phone }, null, `${API_URL}/admin/v1/user/${id}/phone`);
    }

    /**
     * @param  { Object } data       - data to be updated
     * @param  { String } account_id - the account to update
     * @return { Observable }
     */
    public updateAccount(data: any, account_id: string): Observable<any> {
        return this.put(data, null, `${API_URL}/admin/v3/accounts/${account_id}`);
    }

    public deleteAccount(account_id: string): Observable<any> {
        return this.delete(null, `${API_URL}/admin/v3/accounts/${account_id}`);
    }

    // Kyc functions
    public uploadDoc(url, tag, id) {
        return this.post({ url }, null, `${API_URL}/admin/v1/kyc/file/${tag}/${id}`);
    }

    public removeDoc(tag, id) {
        return this.delete(null, `${API_URL}/admin/v1/kyc/file/${tag}/${id}`, { tag });
    }

    /**
     *
     * @param independent - If account is private / autonomo
     * @param company  - If account if company / empresa
     * @param create - If account should be created
     * @param account_id  - The id of the account
     */
    public checkLemonKyc(independent, company, create = 0, account_id) {
        return this.post({
            company, create, independent,
        }, null, `${API_URL}/admin/v1/kyc/lemon/${account_id}`);
    }

    public uploadLemonFiles(independent, company, create = 0, account_id) {
        return this.post({
            company, create, id: account_id, independent,
        }, null, `${API_URL}/admin/v1/kyc/${account_id}/lemon/upload`);
    }

    public getDocuments(account_id) {
        return this.get(null, null, `${API_URL}/admin/v1/kyc/uploads/${account_id}`);
    }

    public sendChangeDelegateCsv(csv_url: string, id) {
        return this.post({
            delegated_change_id: id,
            path: csv_url,
        }, null, `${API_URL}/admin/v1/delegated_change_data/csv`);
    }

    public createChangeDelegate(scheduled_time: string) {
        return this.post({ scheduled_at: scheduled_time }, null, `${API_URL}/admin/v1/delegated_changes`);
    }

    public getChangeDelegateList() {
        return this.get(null, null, `${API_URL}/admin/v1/delegated_changes`);
    }

    public getChangeDelegateDataList(id, offset = 0, limit = 10, sort = 'id', order = 'desc', search = '') {
        return this.get(null, {
            delegated_change_id: id,
            limit, offset, order, search, sort,
        }, `${API_URL}/admin/v1/delegated_change_data`);
    }

    public updateChangeDelegate(id, data) {
        return this.put(data, null, `${API_URL}/admin/v1/delegated_changes/${id}`);
    }

    public deleteChangeDelegate(id) {
        return this.delete(null, `${API_URL}/admin/v1/delegated_changes/${id}`);
    }

    public getChangeDelegate(id) {
        return this.get(null, null, `${API_URL}/admin/v1/delegated_changes/${id}`);
    }

    public sendChangeDelegateData(data) {
        return this.post(data, null, `${API_URL}/admin/v1/delegated_change_data`);
    }

    public updateChangeDelegateData(id, data) {
        return this.put(data, null, `${API_URL}/admin/v1/delegated_change_data/${id}`);
    }

    public getChangeDelegateData(data) {
        return this.get(data, null, `${API_URL}/admin/v1/delegated_change_data`);
    }

    public deleteChangeDelegateData(id) {
        return this.delete(null, `${API_URL}/admin/v1/delegated_change_data/${id}`);
    }

    public listAccountsV3(opts: ListAccountsParams) {
        if (!opts.search) {
            delete opts.search;
        }
        return this.get(null, opts, `${API_URL}/admin/v3/accounts`)
            .pipe(map((resp) => {
                resp.data.elements = resp.data.elements.map(this.cs.mapCompany.bind(this.cs));
                return resp;
            }));
    }

    public searchAccountsV3(opts: SearchAccountsParams) {
        return this.get(null, opts, `${API_URL}/admin/v3/accounts/search`)
            .pipe(map((resp) => {
                resp.data.elements = resp.data.elements.map(this.cs.mapCompany.bind(this.cs));
                return resp;
            }));
    }

    public getAccountsV3(opts: ListAccountsParams) {
        if (!opts.query.search) {
            delete opts.query.search;
        }
        return this.get(null, opts, `${API_URL}/admin/v3/accounts`)
            .pipe(map((resp) => {
                resp.data.elements = resp.data.elements.map(this.cs.mapCompany.bind(this.cs));
                return resp;
            }));
    }

    public exportAccountsV3(opts: any) {
        if (!opts.search) {
            delete opts.search;
        }
        return this.get(null, opts, `${API_URL}/admin/v3/accounts/export`, { Accept: '*/*' }, { responseType: 'text' });
    }

    public listUsersV3(opts: ListAccountsParams) {
        if (!opts.search) {
            delete opts.search;
        }
        return this.get(null, opts, `${API_URL}/admin/v3/users`);
    }

    public exportUsersV3(opts: ListAccountsParams) {
        if (!opts.search) {
            delete opts.search;
        }
        return this.get(null, opts, `${API_URL}/admin/v3/users/export`, { Accept: '*/*' }, { responseType: 'text' });
    }

    public getUserV3(id) {
        return this.get(null, {}, `${API_URL}/admin/v3/users/${id}`);
    }

    public setMapVisibility(account_id, on_map) {
        return this.put(
            { on_map }, null,
            `${API_URL}/admin/v3/accounts/${account_id}`,
        ).pipe(
            map(this.extractData),
            catchError(this.handleError.bind(this)),
        );
    }
}
