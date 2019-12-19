import { Component, Input } from '@angular/core';
import { TablePageBase } from 'src/bases/page-base';
import { TlHeader, TableListOptions } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { LW_ERROR_MONEY_OUT, processLwTx } from 'src/data/lw-constants';
import { ControlesService } from 'src/services/controles/controles.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { CreateLemonWithdrawalDia } from 'src/dialogs/lemonway/create-lemon-withdrawal/create-lemon-withdrawal.dia';

@Component({
    selector: 'lw-money-out-tab',
    templateUrl: './money-out.html',
})
export class LwTabMoneyOut extends TablePageBase {
    @Input() public id = '';
    public withdrawals = [];
    public lwInfo: any = {};
    public pageName = 'Lemonway';
    public loading = true;
    public headers: TlHeader[] = [
        {
            sort: 'ID',
            title: 'ID',
            type: 'code',
        }, {
            sort: 'DEB',
            title: 'Amount',
            type: 'number',
            suffix: '€',
            accessor: (el) => {
                return el.DEB;
            },
            statusClass(value) {
                return 'col-error';
            },
        }, {
            sort: 'INT_STATUS',
            title: 'Status',
            type: 'code',
            tooltip(el) {
                return el.status_text + ' (' + el.INT_STATUS + ')';
            },
        }, {
            sort: 'DATE',
            title: 'Date',
            type: 'date',
        }, {
            sort: 'MSG',
            title: 'Concept',
        },
    ];
    public tableOptions: Partial<TableListOptions> = {
        sortEnabled: false,
    };
    public error = null;

    constructor(
        public controles: ControlesService,
        public router: Router,
        public ls: LoginService,
        public titleService: Title,
        public alerts: AlertsService,
        public accCrud: AccountsCrud,
        public route: ActivatedRoute,
    ) { super(); }

    public search() {
        this.getMoneyTxs();
    }

    public newWithdrawal() {
        return this.alerts.openModal(CreateLemonWithdrawalDia, {
            id: this.id,
        }).subscribe((resp) => {
            this.search();
        });
    }

    public getMoneyTxs() {
        this.loading = true;
        this.accCrud.lwGetMoneyTxList([this.lwInfo.ID])
            .subscribe((resp) => {
                this.total = resp.data.COUNT;
                this.sortedData = resp.data.TRANS
                    .map(processLwTx)
                    .map((el) => {
                        el.status_text = LW_ERROR_MONEY_OUT[el.INT_STATUS];
                        return el;
                    });
                this.loading = false;
            });
    }
}
