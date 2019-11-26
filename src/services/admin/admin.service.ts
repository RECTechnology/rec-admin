import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { UserService } from '../user.service';
import { LoginService } from '../auth/auth.service';
import { API_URL } from '../../data/consts';
import { NotificationService } from '../notifications/notifications.service';
import { CompanyService } from '../company/company.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';

const deprecatedMessage = (method) => {
    console.warn('AdminService::' + method + ' is deprecated... will be removed in the future...');
};

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
        deprecatedMessage('getWithdrawals');
        return this.get(null, null, `${API_URL}/admin/v1/treasure_withdrawals`);
    }

    public addWithdrawal(data) {
        deprecatedMessage('addWithdrawal');
        return this.post(data, null, `${API_URL}/admin/v1/treasure_withdrawals`);
    }

    public getWithdrawal(id) {
        deprecatedMessage('getWithdrawal');
        return this.get(null, null, `${API_URL}/admin/v1/treasure_withdrawals/${id}`);
    }

    public createWithdrawal(data) {
        deprecatedMessage('createWithdrawal');
        return this.post(data, null, `${API_URL}/admin/v1/treasure_withdrawals`);
    }

    public getWithdrawalValidations() {
        deprecatedMessage('getWithdrawalValidations');
        return this.get(null, null, `${API_URL}/admin/v1/treasure_withdrawal_validations`);
    }

    public validateWithdrawalAttempt(id, data) {
        deprecatedMessage('validateWithdrawalAttempt');
        return this.put(data, null, `${API_URL}/admin/v1/treasure_withdrawal_validations/${id}`);
    }

    public deactiveUser(id_user) {
        deprecatedMessage('deactiveUser');
        return this.post({}, null, `${API_URL}/admin/v1/deactiveuser/${id_user}`);
    }

    public activeUser(id_user) {
        deprecatedMessage('activeUser');
        return this.post({}, null, `${API_URL}/admin/v1/activeuser/${id_user}`);
    }

    /**
     * @param {String} group_id - the group to delete user from
     * @param {String} user_id - the user to delete
     * @return {Observable}
     */
    public removeUserFromAccount(group_id: string, user_id: string): Observable<any> {
        deprecatedMessage('removeUserFromAccount');
        return this.delete(null, `${API_URL}/admin/v2/groups/${group_id}/${user_id}`);
    }

    public updateUser(id, data) {
        deprecatedMessage('updateUser');
        return this.put(data, null, `${API_URL}/admin/v3/users/${id}`);
    }

    public updateUserKyc(id, data) {
        deprecatedMessage('updateUserKyc');
        return this.put(data, null, `${API_URL}/admin/v3/kycs/${id}`);
    }

    public updateUserPhone(id, prefix, phone) {
        deprecatedMessage('updateUserPhone');
        return this.put({ prefix, phone }, null, `${API_URL}/admin/v1/user/${id}/phone`);
    }

    /**
     * @param  { Object } data       - data to be updated
     * @param  { String } account_id - the account to update
     * @return { Observable }
     */
    public updateAccount(data: any, account_id: string): Observable<any> {
        deprecatedMessage('updateAccount');
        return this.put(data, null, `${API_URL}/admin/v3/accounts/${account_id}`);
    }

    public deleteAccount(account_id: string): Observable<any> {
        deprecatedMessage('deleteAccount');
        return this.delete(null, `${API_URL}/admin/v3/accounts/${account_id}`);
    }

    // Kyc functions
    public uploadDoc(url, tag, id) {
        deprecatedMessage('uploadDoc');
        return this.post({ url }, null, `${API_URL}/admin/v1/kyc/file/${tag}/${id}`);
    }

    public removeDoc(tag, id) {
        deprecatedMessage('removeDoc');
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
        deprecatedMessage('checkLemonKyc');
        return this.post({
            company, create, independent,
        }, null, `${API_URL}/admin/v1/kyc/lemon/${account_id}`);
    }

    public uploadLemonFiles(independent, company, create = 0, account_id) {
        deprecatedMessage('uploadLemonFiles');
        return this.post({
            company, create, id: account_id, independent,
        }, null, `${API_URL}/admin/v1/kyc/${account_id}/lemon/upload`);
    }

    public getDocuments(account_id) {
        deprecatedMessage('getDocuments');
        return this.get(null, null, `${API_URL}/admin/v1/kyc/uploads/${account_id}`);
    }

    public sendChangeDelegateCsv(csv_url: string, id) {
        deprecatedMessage('sendChangeDelegateCsv');
        return this.post({
            delegated_change_id: id,
            path: csv_url,
        }, null, `${API_URL}/admin/v1/delegated_change_data/csv`);
    }

    public createChangeDelegate(scheduled_time: string) {
        deprecatedMessage('createChangeDelegate');
        return this.post({ scheduled_at: scheduled_time }, null, `${API_URL}/admin/v1/delegated_changes`);
    }

    public getChangeDelegateList() {
        deprecatedMessage('getChangeDelegateList');
        return this.get(null, null, `${API_URL}/admin/v1/delegated_changes`);
    }

    public getChangeDelegateDataList(id, offset = 0, limit = 10, sort = 'id', order = 'desc', search = '') {
        deprecatedMessage('getChangeDelegateDataList');
        return this.get(null, {
            delegated_change_id: id,
            limit, offset, order, search, sort,
        }, `${API_URL}/admin/v1/delegated_change_data`);
    }

    public updateChangeDelegate(id, data) {
        deprecatedMessage('updateChangeDelegate');
        return this.put(data, null, `${API_URL}/admin/v1/delegated_changes/${id}`);
    }

    public deleteChangeDelegate(id) {
        deprecatedMessage('deleteChangeDelegate');
        return this.delete(null, `${API_URL}/admin/v1/delegated_changes/${id}`);
    }

    public getChangeDelegate(id) {
        deprecatedMessage('getChangeDelegate');
        return this.get(null, null, `${API_URL}/admin/v1/delegated_changes/${id}`);
    }

    public sendChangeDelegateData(data) {
        deprecatedMessage('sendChangeDelegateData');
        return this.post(data, null, `${API_URL}/admin/v1/delegated_change_data`);
    }

    public updateChangeDelegateData(id, data) {
        deprecatedMessage('updateChangeDelegateData');
        return this.put(data, null, `${API_URL}/admin/v1/delegated_change_data/${id}`);
    }

    public getChangeDelegateData(data) {
        deprecatedMessage('getChangeDelegateData');
        return this.get(data, null, `${API_URL}/admin/v1/delegated_change_data`);
    }

    public deleteChangeDelegateData(id) {
        deprecatedMessage('deleteChangeDelegateData');
        return this.delete(null, `${API_URL}/admin/v1/delegated_change_data/${id}`);
    }

    public setMapVisibility(account_id, on_map) {
        deprecatedMessage('setMapVisibility');
        return this.put(
            { on_map }, null,
            `${API_URL}/admin/v3/accounts/${account_id}`,
        ).pipe(
            map(this.extractData),
            catchError(this.handleError.bind(this)),
        );
    }
}
