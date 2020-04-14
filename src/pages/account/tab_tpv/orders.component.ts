import { AdminService } from './../../../services/admin/admin.service';
import { Component, Input } from '@angular/core';
import { TablePageBase } from 'src/bases/page-base';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/services/user.service';
import { CompanyService } from 'src/services/company/company.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { ControlesService } from 'src/services/controles/controles.service';
import { WalletService } from 'src/services/wallet/wallet.service';
import { LoginService } from 'src/services/auth/auth.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AlertsService } from 'src/services/alerts/alerts.service';
import {
    TableListOptions, TlHeader, TlItemOption,
} from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { TlHeaders } from 'src/data/tl-headers';
import { Order } from 'src/shared/entities/order.ent';

@Component({
    selector: 'tpv-orders',
    templateUrl: './orders.html',
})
export class TpvOrdersComponent extends TablePageBase {
    @Input() public id = null;
    public pageName = 'TPV_ORDERS';

    public tableOptions: TableListOptions = {
        optionsType: 'buttons',
        // onClick: (entry) => this.viewAccount(entry),
    };

    public headerOpts: TableListHeaderOptions = { input: true, refresh: true, deepLinkQuery: true };
    public headers: TlHeader[] = [
        TlHeaders.Id,
        TlHeaders.generate('reference', {
            accessor: 'reference',
            title: 'Reference',
        }),
        TlHeaders.generate('amount', {
            type: 'code',
            accessor: (item) => `${item.amount} €`,
        }),
        TlHeaders.StatusCustom((el: any) => ({
            'col-info': el === Order.STATUS_CREATED,
            'col-warning': el === Order.STATUS_EXPIRED || Order.STATUS_REFUNDED,
            'col-success': el === Order.STATUS_DONE,
            'col-purple': el === Order.STATUS_IN_PROGRESS,
        })),
        TlHeaders.Updated,
    ];
    public itemOptions: TlItemOption[] = [
        // TlItemOptions.Edit(this.viewEditAccount.bind(this)),
    ];

    constructor(
        public titleService: Title,
        public route: ActivatedRoute,
        public dialog: MatDialog,
        public us: UserService,
        public companyService: CompanyService,
        public utils: UtilsService,
        public router: Router,
        public controles: ControlesService,
        public ws: WalletService,
        public ls: LoginService,
        public crudAccounts: AccountsCrud,
        public admin: AdminService,
        public alerts: AlertsService,
    ) {
        super();
    }

    public getCleanParams(query?: string) {
        return {
            limit: this.limit,
            offset: this.offset,
            order: this.sortDir,
            search: query || this.query,
            sort: this.sortID,
        };
    }

    public search(query: string = this.query) {
        const data: any = this.getCleanParams(query);
        this.loading = true;
        this.query = query;

        this.searchObs = this.admin.listPaymentOrders(data)
            .subscribe(
                (resp: any) => {
                    this.data = resp.data.elements;
                    this.total = resp.data.total;
                    this.sortedData = this.data.slice();
                    this.showing = this.data.length;
                    this.loading = false;
                }, (error) => {
                    this.loading = false;
                });
        return this.searchObs;
    }
}
