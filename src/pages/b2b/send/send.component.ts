import { Component } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';
import { B2bService } from 'src/services/b2b/b2b.service';
import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { Router } from '@angular/router';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';
import { TlHeader, TlItemOption, TableListOptions } from 'src/components/table-list/tl-table/tl-table.component';
import { TablePageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { AlertsService } from 'src/services/alerts/alerts.service';

@Component({
    selector: 'b2b-send',
    templateUrl: './send.html',
})
export class B2BSendComponent extends TablePageBase {
    public pageName = 'Mailing';
    public mails = [];
    public loading = true;
    public headers: TlHeader[] = [
        {
            sort: 'id',
            title: 'ID',
            type: 'code',
        },
        {
            sort: 'subject',
            title: 'Subject',
        },
        {
            sort: 'status',
            title: 'Status',
            type: 'status',
            statusClass: (el: any) => ({
                'col-info': el === MailingCrud.STATUS_CREATED,
                'col-warning': el === MailingCrud.STATUS_SCHEDULED,
                'col-success': el === MailingCrud.STATUS_PROCESSED,
                // 'col-info': el !== MailingCrud.STATUS_CREATED,
                // 'col-info': el !== MailingCrud.STATUS_SCHEDULED,
            }),
            translate: true,
        },
        {
            accessor: (item) => item.deliveries.length,
            sort: 'deliveries',
            title: 'Deliveries',
        },
        {
            sort: 'created',
            title: 'Created',
            type: 'date',
        },
    ];
    public itemOptions: TlItemOption[] = [
        {
            callback: this.editMail.bind(this),
            text: 'Edit',
            icon: 'fa-edit',
            ngIf: (item) => {
                return item.status !== 'processed';
            },
        },
        {
            callback: this.editMail.bind(this),
            text: 'View',
            icon: 'fa-eye',
            ngIf: (item) => {
                return item.status === 'processed';
            },
        },
        {
            callback: this.removeMail.bind(this),
            text: 'Remove',
            icon: 'fa-trash',
            class: 'col-error',
            disabled: (el) => el.status !== 'created',
        },
    ];
    public options: TableListOptions = {
        optionsType: 'buttons',
    };

    public selectedStatus = null;
    public STATUSES = [
        MailingCrud.STATUS_CREATED,
        MailingCrud.STATUS_SCHEDULED,
        MailingCrud.STATUS_PROCESSED,
    ];

    constructor(
        public controles: ControlesService,
        public b2bCrud: B2bService,
        public mailDeliveries: MailingDeliveriesCrud,
        public mailing: MailingCrud,
        public router: Router,
        public ls: LoginService,
        public titleService: Title,
        public alerts: AlertsService,
    ) {
        super();
    }

    public filterStatus(status) {
        this.selectedStatus = status;
        this.search();
    }

    public removeMail(mail) {
        this.mailing.remove(mail.id)
            .subscribe((resp) => {
                this.alerts.showSnackbar('Removed mail correctly');
                this.search();
            }, (error) => {
                this.alerts.showSnackbar(error.message);
            });
    }

    public createMail() {
        this.router.navigate(['/rec/mailing/new']);
    }

    public editMail(item) {
        this.router.navigate(['/rec/mailing/' + item.id]);
    }

    public search(query?) {
        this.loading = true;
        this.mailing.search({
            dir: this.sortDir,
            limit: this.limit,
            offset: this.offset,
            search: query || this.query,
            sort: this.sortID,
            status: this.selectedStatus,
        }).subscribe((resp) => {
            this.data = resp.data.elements;
            this.sortedData = this.data.slice();
            this.showing = this.data.length;
            this.total = resp.data.total;
            this.loading = false;
        });
    }
}
