import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { UserService } from '../user.service';
import { LoginService } from '../auth/auth.service';
import { API_URL } from '../../data/consts';
import { NotificationService } from '../notifications/notifications.service';
import { CompanyService } from '../company/company.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Pos } from 'src/shared/entities/pos.ent';

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

    // /admin/v3/pos y payment_orders

    public createPos(account_id) {
        return this.post({ account_id }, null, `${API_URL}/admin/v3/pos`);
    }

    public editPos(id, data: Partial<Pos>) {
        return this.put(data, null, `${API_URL}/admin/v3/pos/${id}`);
    }

    public deletePos(id: string) {
        return this.delete(null, `${API_URL}/admin/v3/pos/${id}`);
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

    public addUserToAccount(account_id, user_dni, role): Observable<any> {
        return this.post(
            { user_dni, role },
            null,
            `${API_URL}/manager/v1/groups/${account_id}`,
        ).pipe(
            map(this.extractData),
            catchError(this.handleError.bind(this)),
        );
    }

    public createAndAddUser(account_id, data): Observable<any> {
        const params = new HttpParams();
        for (const key in data) {
            if (key) {
                params.set(key, data[key]);
            }
        }

        return this.post(
            params.toString(),
            null,
            `${API_URL}/account/${account_id}/v1/add_user`,
        ).pipe(
            map(this.extractData),
            catchError(this.handleError.bind(this)),
        );
    }

    public removeUserFromAccount(group_id: string, user_id: string): Observable<any> {
        deprecatedMessage('removeUserFromAccount');
        return this.delete(null, `${API_URL}/admin/v2/groups/${group_id}/${user_id}`);
    }

    public updateUserKyc(id, data) {
        deprecatedMessage('updateUserKyc');
        return this.put(data, null, `${API_URL}/admin/v3/kycs/${id}`);
    }

    public updateUserPhone(id, prefix, phone) {
        deprecatedMessage('updateUserPhone');
        return this.put({ prefix, phone }, null, `${API_URL}/admin/v1/user/${id}/phone`);
    }

    public deleteAccount(account_id: string): Observable<any> {
        deprecatedMessage('deleteAccount');
        return this.delete(null, `${API_URL}/admin/v3/accounts/${account_id}`);
    }

    public sendChangeDelegateCsv(csv_url: string, id) {
        deprecatedMessage('sendChangeDelegateCsv');
        return this.post({
            delegated_change_id: id,
            path: csv_url,
        }, null, `${API_URL}/admin/v1/delegated_change_data/csv`);
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
