import { EventsService } from 'src/services/events/events.service';
import { Component } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';
import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { Router } from '@angular/router';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';
import {
    TlHeader, TlItemOption, TableListOptions,
} from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { TablePageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { TlHeaders } from 'src/data/tl-headers';
import { TlItemOptions } from 'src/data/tl-item-options';

@Component({
    selector: 'b2b-send',
    templateUrl: './send.html',
})
export class B2BSendComponent extends TablePageBase {
    public pageName = 'Mailing';
    public mails = [];
    public loading = true;
    public headers: TlHeader[] = [
        TlHeaders.Id,
        TlHeaders.generate('subject'),
        TlHeaders.length('attachments'),
        TlHeaders.StatusCustom((el: any) => ({
            'col-info': el === MailingCrud.STATUS_CREATED,
            'col-warning': el === MailingCrud.STATUS_SCHEDULED,
            'col-success': el === MailingCrud.STATUS_PROCESSED,
        })),
        TlHeaders.length('deliveries'),
        TlHeaders.Created,
    ];
    public itemOptions: TlItemOption[] = [
        TlItemOptions.Edit(this.editMail.bind(this)).extend({
            ngIf: (item) => item.status !== 'processed',
        }),
        TlItemOptions.Edit(this.editMail.bind(this)).extend({
            ngIf: (item) => item.status === 'processed',
        }),
        TlItemOptions.Delete(this.removeMail.bind(this)).extend({
            disabled: (item) => item.status === 'processed',
        }),
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
        public mailDeliveries: MailingDeliveriesCrud,
        public mailing: MailingCrud,
        public router: Router,
        public ls: LoginService,
        public titleService: Title,
        public alerts: AlertsService,
        public events: EventsService,
    ) {
        super(router);
    }

    public filterStatus(status) {
        this.selectedStatus = status;
        this.search();
    }

    public removeMail(mail) {
        return this.alerts.confirmDeletion('Mail')
            .subscribe((shouldDelete) => {
                if (shouldDelete) {
                    this.mailing.remove(mail.id)
                        .subscribe((resp) => {
                            this.alerts.showSnackbar('REMOVED_MAIL_CORRECTLY');
                            this.search();
                        }, (error) => {
                            this.alerts.showSnackbar(error.message);
                        });
                }
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
            order: this.sortDir,
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
