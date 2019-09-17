import { Component } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';
import { B2bService } from 'src/services/b2b/b2b.service';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { EntityTabBase } from '../settings/components/base.tab';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';
import { TlHeader, TlItemOption } from 'src/components/table-list/tl-table/tl-table.component';
import { TablePageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'b2b-send',
    templateUrl: './send.html',
})
export class B2BSendComponent extends TablePageBase {
    public pageName = 'Mailing';
    public mails = [];

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
            accessor: (item) => item.deliveries.length,
            sort: 'deliveries',
            title: 'Deliveries',
        },
        {
            sort: 'processed',
            title: 'Processed',
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
        },
    ];

    constructor(
        public controles: ControlesService,
        public b2bCrud: B2bService,
        public snackbar: MySnackBarSevice,
        public mailDeliveries: MailingDeliveriesCrud,
        public mailing: MailingCrud,
        public dialog: MatDialog,
        public router: Router,
        public ls: LoginService,
        public titleService: Title,
    ) {
        super();
    }

    public createMail() {
        this.router.navigate(['/rec/mailing/new']);
    }

    public editMail(item) {
        this.router.navigate(['/rec/mailing/' + item.id]);
    }

    public ngOnInit() {
        this.search();
    }

    public search() {
        this.loading = true;
        this.mailing.search({
            dir: this.sortDir,
            limit: this.limit,
            offset: this.offset,
            query: this.query,
            sort: this.sortID,
        }).subscribe((resp) => {
            this.data = resp.data.elements;
            this.sortedData = this.data.slice();
            this.showing = this.data.length;
            this.total = resp.data.total;
            this.loading = false;
        });
    }
}
