import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlesService } from 'src/services/controles/controles.service';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';
import { CreateDelivery } from '../create-delivery/create-delivery';
import { TablePageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { TlHeader } from 'src/components/table-list/tl-table/tl-table.component';

import * as moment from 'moment';
import { FileUpload } from 'src/components/dialogs/file-upload/file-upload.dia';

const now = new Date();

@Component({
    selector: 'send-mail',
    templateUrl: './send-mail.dia.html',
})
export class SendMail extends TablePageBase {
    public blured = false;
    public focused = false;
    public saved = false;

    public pageName = 'Send Email';
    public moreThan5 = false;

    public mail = {
        content: '',
        scheduled_at:
            `${now.getFullYear()}-${now.getMonth().toString().padStart(2, '0')}-${
            now.getDate().toString().padStart(2, '0')}T${
            now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
        subject: '',
    };

    public mailCopy = {
        content: '',
        scheduled_at:
            `${now.getFullYear()}-${now.getMonth().toString().padStart(2, '0')}-${
            now.getDate().toString().padStart(2, '0')}T${
            now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
        subject: '',
    };

    public isEdit = false;
    public id = null;

    public deliveries = [];
    public totalDeliveries = 0;

    public headers: TlHeader[] = [
        {
            sort: 'id',
            title: 'ID',
            type: 'code',
        },
        {
            accessor: (item) => {
                return `${item.account.name} (${item.account.id})`;
            },
            sort: 'account',
            title: 'Account',
        },
        {
            accessor: (item) => {
                return item.account.email;
            },
            sort: 'email',
            title: 'Account Email',
        },
        {
            sort: 'status',
            statusClass: (status) => {
                return 'status-' + status;
            },
            title: 'Status',
            type: 'status',
        },
        {
            sort: 'created',
            title: 'Created',
            type: 'date',
        },
    ];

    public sendScheduled = false;

    constructor(
        public us: UserService,
        public translate: TranslateService,
        public mailDeliveries: MailingDeliveriesCrud,
        public snackbar: MySnackBarSevice,
        public route: ActivatedRoute,
        public router: Router,
        public controls: ControlesService,
        public mailing: MailingCrud,
        public dialog: MatDialog,
        public ls: LoginService,
        public titleService: Title,
    ) {
        super();
    }

    public ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.id_or_new && params.id_or_new !== 'new' && /[0-9]+/.test(params.id_or_new)) {
                this.isEdit = true;
                this.id = params.id_or_new;
                this.getMail();
                this.search();
            } else {
                this.mailCopy = { ...this.mail };
            }
        });
    }

    public getMail() {
        this.mailing.find(this.id)
            .subscribe((resp) => {
                this.mail = resp.data;
                const now = new Date(this.mail.scheduled_at);

                this.mail.scheduled_at =
                    `${now.getFullYear()}-${now.getMonth().toString().padStart(2, '0')}-${
                    now.getDate().toString().padStart(2, '0')}T${
                    now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                this.mailCopy = { ...this.mail };
            });
    }

    public search() {
        this.loading = true;
        this.mailDeliveries.search({
            dir: this.sortDir,
            limit: this.limit,
            mailing_id: this.id,
            offset: this.offset,
            query: this.query,
            sort: this.sortID,
        }).subscribe((resp) => {
            this.data = resp.data.elements;
            this.sortedData = this.data.slice(0, 5);
            this.showing = this.data.length;
            this.total = resp.data.total;
            this.moreThan5 = this.total > 5;
            this.loading = false;
        });
    }

    public showAll() {
        this.sortedData = this.data.slice();
        this.moreThan5 = false;
    }

    public createDelivery() {
        const ref = this.dialog.open(CreateDelivery);
        ref.componentInstance.id = this.id;
        ref.componentInstance.selectedAccounts = this.data.map((el) => el.account);
        ref.componentInstance.deliveries = this.data.map((el) => el.account);
        ref.afterClosed()
            .subscribe((resp) => {
                this.search();
            }, (err) => {
                this.snackbar.open(err.message);
                this.loading = false;
            });
    }

    public getStatusColor(status) {
        switch (status) {
            case 'errored': return 'error';
            case 'sent': return 'success';
            case 'scheduled': return 'primary';
        }
    }

    public deleteAccount(item) {
        this.loading = true;
        this.mailDeliveries.remove(item.id)
            .subscribe((resp) => {
                this.snackbar.open('Deleted Account Correctly');
                this.loading = false;
                this.search();
            }, (err) => {
                this.snackbar.open(err.message);
                this.loading = false;
            });
    }

    public updateMail() {
        this.loading = true;
        const data: any = Object.assign({}, this.mail);
        this.mailing.update(this.id, {
            content: data.content,
            scheduled_at: moment(data.scheduled_at).toISOString(),
            subject: data.subject,
        }).subscribe((resp) => {
            this.snackbar.open('Edited Mail Correctly');
            this.loading = false;
            this.saved = true;
            this.mail = resp.data;
            this.mailCopy = Object.assign({}, this.mail);
        }, (err) => {
            this.snackbar.open(err.message);
            this.loading = false;
        });
    }

    public createMail() {
        this.loading = true;
        const data: any = Object.assign({}, this.mail);
        this.mailing.create({
            content: data.content,
            scheduled_at: new Date(data.scheduled_at).toISOString(),
            subject: data.subject,
        }).subscribe((resp) => {
            this.snackbar.open('Created Mail Correctly');
            this.loading = false;
            this.isEdit = true;
            this.id = resp.data.id;
            this.router.navigate(['/rec/mailing/' + this.id]);
        }, (err) => {
            this.snackbar.open(err.message);
            this.loading = false;
        });
    }

    public isSaveDisabled() {
        return this.mail.subject === this.mailCopy.subject && this.mail.content === this.mailCopy.content;
    }

    public created(event) {
    }

    public changedEditor(event) {
        this.mail.content = event.html ? event.html : this.mail.content;
    }

    public focus($event) {
        this.focused = true;
        this.blured = false;
    }

    public blur($event) {
        this.focused = false;
        this.blured = true;
    }

    public selectFile(selectedImage?) {
        const dialogRef = this.dialog.open(FileUpload);
        dialogRef.componentInstance.selectedImage = selectedImage;
        dialogRef.componentInstance.hasSelectedImage = !!selectedImage;
        return dialogRef.afterClosed().subscribe((attachmentLink) => {
            if (attachmentLink) {
                this.loading = true;
                this.mailing.addAttachment(this.id, attachmentLink)
                    .subscribe((resp) => {
                        this.snackbar.open('Added attachment correctly');
                        this.loading = false;
                    }, (err) => {
                        this.snackbar.open(err.message);
                        this.loading = false;
                    });
            }
        });
    }
}
