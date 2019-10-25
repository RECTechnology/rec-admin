import { Component, HostListener, ViewChild, Input } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
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
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/services/guards/can-go-back.guard';
import { LANGS, LANG_MAP } from 'src/data/consts';

const now = new Date();

@Component({
    selector: 'send-mail',
    templateUrl: './send-mail.dia.html',
})
export class SendMail extends TablePageBase implements ComponentCanDeactivate {
    public blured = false;
    public focused = false;
    public saved = true;

    public pageName = 'Send Email';
    public moreThan5 = false;

    public mail: any = {
        content: '',
        scheduled_at:
            `${now.getFullYear()}-${now.getMonth().toString().padStart(2, '0')}-${
            now.getDate().toString().padStart(2, '0')}T${
            now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
        subject: '',
        attachments: {},
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
    public attachments = [];
    public validationErrors: any = [];
    public validationErrorName = '';
    public readonly = false;
    public addLink = false;
    public linkName = '';
    public linkAttachment = '';

    public scheduledDate = '';

    public date = null;
    public time = null;
    public title = '';
    public justCreated = false;
    public firstRun = true;

    public langs = LANGS;
    public lang = LANG_MAP[localStorage.getItem('lang') || 'en'] || LANGS[1];
    public langMap = {
        cat: 'ca',
        en: 'en',
        es: 'es',
    };

    constructor(
        public us: UserService,
        public translate: TranslateService,
        public mailDeliveries: MailingDeliveriesCrud,
        public route: ActivatedRoute,
        public router: Router,
        public controls: ControlesService,
        public mailing: MailingCrud,
        public ls: LoginService,
        public titleService: Title,
        public alerts: AlertsService,
        public utils: UtilsService,
    ) {
        super();

        this.lang[this.lang.abrev] = LANG_MAP[this.us.userData.locale];

        console.log('this.lang[this.lang.abrev]', this.langMap[this.lang.abrev]);
        translate.onLangChange.subscribe(() => {
            this.update();
        });
    }

    /**
     * Below methods are to disable navigation if not saved or item is empty
     * And will show a confirmation modal if return -> false, and will navigate if return -> true
     */
    @HostListener('window:beforeunload')
    public canDeactivate(): any {
        this.title = this.mail.subject;
        return this.justCreated ? this.justCreated = true : this.saved && (this.mail.subject || this.mail.content);
    }

    public onDiscard() {
        this.mailing.remove(this.id).subscribe((resp) => {
            this.alerts.showSnackbar('Deleted mail (' + this.id + ')');
        });
    }

    public onSaveDraft() {
        console.log('save draft', this.id, this.isEdit);
        this.isEdit ? this.saveMail() : this.createMail(false);
    }

    public ngOnInit() {
        this.route.params.subscribe((params) => {
            // if (params.id_or_new === 'new') { this.createMail(); }
            if (params.id_or_new && params.id_or_new !== 'new' && /[0-9]+/.test(params.id_or_new)) {
                this.isEdit = true;
                this.id = params.id_or_new;
                this.update();
            } else {
                this.mailCopy = { ...this.mail };
            }
        });
        super.ngOnInit();
    }

    public update() {
        this.getMail();
        this.search();
    }

    public getMail() {
        console.log('getMail', this.langMap[this.lang.abrev]);
        this.mailing.find(this.id, this.langMap[this.lang.abrev])
            .subscribe((resp) => {
                this.mail = resp.data;
                const scheduled = moment(this.mail.scheduled_at).toDate();

                this.readonly = [MailingCrud.STATUS_PROCESSED, MailingCrud.STATUS_SCHEDULED].includes(this.mail.status);

                this.mail.attachments = this.mail.attachments.map ? {} : this.mail.attachments;
                this.attachments = Object.keys(this.mail.attachments).map((el) => {
                    return {
                        name: el,
                        file: this.mail.attachments[el],
                    };
                });

                this.deliveries = this.mail.deliveries.map((el) => {
                    return {
                        ...el.account,
                        ...el,
                        delivery_id: el.id,
                    };
                });

                this.saved = true;
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

    public getStatusColor(status) {
        switch (status) {
            case MailingDeliveriesCrud.STATUS_ERRORED: return 'error';
            case MailingDeliveriesCrud.STATUS_SENT: return 'success';
            case MailingDeliveriesCrud.STATUS_SCHEDULED: return 'primary';
        }
    }

    public deleteAccount(item) {
        this.loading = true;
        this.mailDeliveries.remove(item.id)
            .subscribe((resp) => {
                this.alerts.showSnackbar('Deleted Account Correctly');
                this.loading = false;
                this.search();
            }, (err) => {
                this.alerts.showSnackbar(err.message);
                this.loading = false;
            });
    }

    public cancel() {
        this.updateMail({ status: MailingCrud.STATUS_CREATED });
    }

    public updateMail(data, message = 'Saved Mail Correctly') {
        this.mailing.update(this.id, data, this.langMap[this.lang.abrev]).subscribe((resp) => {
            this.alerts.showSnackbar(message + ': (' + this.id + ')');
            this.loading = false;
            this.saved = true;
            this.mail = resp.data;
            this.mailCopy = Object.assign({}, this.mail);
            this.update();
        }, (err) => {
            this.alerts.showSnackbar(err.message);
            this.loading = false;
        });
    }

    public saveMail(upateData = {}) {
        this.loading = true;
        const data: any = Object.assign({}, this.mail);
        this.updateMail({
            content: data.content,
            scheduled_at: moment(data.scheduled_at).toISOString(),
            subject: data.subject,
        });
    }

    public createMail(navigateToMailing = true) {
        this.loading = true;
        const data: any = Object.assign({}, this.mail);
        this.mailing.create({
            content: data.content,
            scheduled_at: new Date(data.scheduled_at).toISOString(),
            subject: data.subject,
        }, this.langMap[this.lang.abrev]).subscribe((resp) => {
            this.alerts.showSnackbar('Created Mail Correctly');
            this.loading = false;
            this.isEdit = true;
            this.id = resp.data.id;
            this.justCreated = true;

            if (navigateToMailing) {
                this.router.navigate(['/rec/mailing/' + this.id]);
            }
        }, (err) => {
            this.alerts.showSnackbar(err.message);
            this.loading = false;
        });
    }

    public isSaveDisabled() {
        return this.mail.subject === this.mailCopy.subject && this.mail.content === this.mailCopy.content;
    }

    // tslint:disable-next-line: no-empty
    public created(event) {
    }

    public changedEditor(event) {
        console.log('asjkdhasidhasñdhjo');
        this.mail.content = event.html ? event.html : this.mail.content;

        // It triggers change on init, and messed up with save logic
        if (!this.firstRun) {
            this.saved = false;
        } else {
            this.firstRun = false;
        }
    }

    public focus($event) {
        this.focused = true;
        this.blured = false;
    }

    public blur($event) {
        this.focused = false;
        this.blured = true;
    }

    public addAttachment(file, name = '') {
        const fname = name || file.split('/').pop();
        console.log(this.mail.attachments);

        const attachments = Object.assign(this.mail.attachments, {
            [fname]: file,
        });

        this.mailing.addAttachment(this.id, attachments, this.langMap[this.lang.abrev])
            .subscribe(() => {
                this.alerts.showSnackbar('Added attachment correctly');
                this.loading = false;
                this.getMail();
            }, (error) => {
                if (error.message.includes('Validation error')) {
                    this.validationErrors = error.errors;
                } else {
                    this.alerts.showSnackbar(error.message, 'ok');
                }
                this.loading = false;
            });
    }

    public removeAttachment(name) {
        delete this.mail.attachments[name];
        this.mailing.addAttachment(this.id, this.mail.attachments, this.langMap[this.lang.abrev])
            .subscribe(() => {
                this.alerts.showSnackbar('Removed attachment correctly');
                this.loading = false;
                this.getMail();
            }, (error) => {
                if (error.message.includes('Validation error')) {
                    this.validationErrors = error.errors;
                } else {
                    this.alerts.showSnackbar(error.message, 'ok');
                }
                this.loading = false;
            });
    }

    public addLinkAttachment() {
        this.addAttachment(this.linkAttachment, this.linkName);

        this.linkAttachment = '';
        this.linkName = '';
        this.addLink = false;
    }

    public selectFile(selectedImage?) {
        console.log('selectedImage', selectedImage);
        this.alerts.openModal(FileUpload, {
            hasSelectedImage: !!selectedImage,
            selectedImage,
        }).subscribe((attachmentLink) => {
            if (attachmentLink) {
                this.loading = true;
                this.addAttachment(attachmentLink);
            }
        });
    }

    public openShowSchedule() {
        console.log('this.mail.scheduled_at', this.mail);
        const now2 = this.mail.scheduled_at ? moment(this.mail.scheduled_at).toDate() : new Date();
        const parts = this.utils.parseDateToParts(now2);
        this.date = parts.dateStr;
        this.time = parts.timeStr;
        this.sendScheduled = true;
    }

    public closeScheduled() {
        this.sendScheduled = false;
    }

    public sendNormal(date = null, message = 'Sent mail correctly') {
        const mailData = {
            scheduled_at: (date ? moment(date) : moment()).toISOString(),
            status: MailingCrud.STATUS_SCHEDULED,
        };

        this.updateMail(mailData, 'Sent mail correctly');
    }

    public createScheduled() {
        this.sendNormal(new Date(this.date + ' ' + this.time), 'Scheduled mail correctly');
        this.sendScheduled = false;
    }

    public selectLang(lang) {
        this.lang = lang;
        this.update();
    }
}
