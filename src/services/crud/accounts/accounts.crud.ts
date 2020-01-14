import { EventsService } from 'src/services/events/events.service';

import { Injectable, Inject } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from 'src/services/company/company.service';
import { RecLang, REC_LANGS } from 'src/types';
import { Account } from 'src/shared/entities/account.ent';
import * as moment from 'moment';
import { Iban } from 'src/shared/entities/iban.ent';

@Injectable()
export class AccountsCrud extends CrudBaseService<Account> {

    public pdfHtml: string = '';
    @Inject(EventsService) public events: EventsService;

    constructor(
        http: HttpClient,
        public us: UserService,
        public cs: CompanyService,
    ) {
        super(http, us);
        this.basePath = '/accounts';
        this.userRole = 'admin';
        this.mapItems = true;
    }

    public mapper(item) {
        return new Account(item);
    }

    public getPdf(account_id, lang: RecLang = REC_LANGS.ES) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'report_clients_providers'];
        return this.get(url, {}, {
            'Accept': 'application/pdf',
            'Content-Language': lang,
            'Accept-Language': lang,
        }, { responseType: 'blob' });
    }

    public getPdfAsHtml(account_id, lang: RecLang = REC_LANGS.ES) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'report_clients_providers'];
        return this.get(url, {}, {
            'Accept': 'text/html',
            'Content-Language': lang,
            'Accept-Language': lang,
        }, { responseType: 'text' });
    }

    public addConsumedProductToAccount(account_id, product_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'consuming_products'];
        return this.post(url, { id: product_id }).pipe(this.itemMapper());
    }

    public addProducedProductToAccount(account_id, product_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'producing_products'];
        return this.post(url, { id: product_id }).pipe(this.itemMapper());
    }

    public removeConsumedProductFromAccount(account_id, product_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'consuming_products', '/', product_id];
        return this.delete(url).pipe(this.itemMapper());
    }

    public removeProducedProductFromAccount(account_id, product_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'producing_products', '/', product_id];
        return this.delete(url).pipe(this.itemMapper());
    }

    public addActivity(account_id, activity_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'activities'];
        return this.post(url, { id: activity_id }).pipe(this.itemMapper());
    }

    public deleteActivity(account_id, activity_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'activities', '/', activity_id];
        return this.delete(url).pipe(this.itemMapper());
    }

    // Lemonway methods
    public lwGetWallet(account_id) {
        const url = [...this.getUrlBase(), '/', account_id, '/', 'integrations', '/', 'lemonway'];
        return this.get(url, {});
    }

    public lwSendFrom(amount, to, from) {
        const url = [...this.getUrlBase(), '/', to, '/', 'integrations', '/', 'lemonway', '/', 'send-from'];
        return this.post(url, { amount, from });
    }

    public lwSendTo(amount, from, to) {
        const url = [...this.getUrlBase(), '/', from, '/', 'integrations', '/', 'lemonway', '/', 'send-to'];
        return this.post(url, { amount, to });
    }

    public createWithdrawal(account, amount, concept, otp, currency) {
        const url = [...this.getUrlBase(), '/', account, '/', 'withdrawals'];
        return this.post(url, { amount, concept, otp, currency });
    }

    public createIBAN(account, data: Partial<Iban>) {
        const url = [...this.getUrlBase(), '/', account, '/', 'ibans'];
        return this.post(url, data);
    }

    public getIbans(account) {
        const url = [...this.getUrlBase(), '/', account, '/', 'ibans'];
        return this.get(url);
    }

    public getWithdrawals(account) {
        const url = [...this.getUrlBase(), '/', account, '/', 'withdrawals'];
        return this.get(url);
    }

    public lwGateway(funct, data) {
        const url = ['/', this.userRole, '/', this.version, '/gateway/lemonway/', funct];
        return this.post(url, data);
    }

    public lwSendPayment(from, to, amount, concept) {
        return this.lwGateway('SendPayment', {
            amount: Number(amount).toFixed(2),
            debitWallet: String(from),
            creditWallet: String(to),
            message: concept,
        });
    }

    public lwMoneyOut(wallet, amount, message, otp) {
        return this.lwGateway('MoneyOut', {
            wallet,
            amount,
            message,
            otp,
        });
    }

    public lwGetP2PList(wallets: string[]) {
        return this.lwGateway('GetP2PTransactions', {
            startDate: moment().subtract('1', 'year').unix(),
            endDate: moment().unix(),
            wallets,
        });
    }

    public lwGetMoneyTxList(wallets: string[]) {
        return this.lwGateway('GetMoneyTransactions', {
            startDate: moment().subtract('1', 'year').unix(),
            endDate: moment().unix(),
            wallets,
        });
    }
}
