import { Component, HostListener, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { UserService } from 'src/services/user.service';
import { ControlesService } from 'src/services/controles/controles.service';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';
import { TablePageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { TlHeader } from 'src/components/scaffolding/table-list/tl-table/tl-table.component';
import { FileUpload } from 'src/components/dialogs/file-upload/file-upload.dia';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { ComponentCanDeactivate } from 'src/services/guards/can-go-back.guard';
import { LANGS, LANG_MAP } from 'src/data/consts';
import { CreateDelivery } from '../create-delivery/create-delivery';


// TODO: cleanup this class a bit

@Component({
    selector: 'send-mail',
    templateUrl: './send-mail.dia.html',
    styleUrls: ['./send-mail.scss'],
})
export class SendMail extends TablePageBase implements ComponentCanDeactivate {
    public pageName = 'Send Email';
    public id = null;
    public blured = false;
    public focused = false;
    public saved = true;
    public isEdit = false;
    public moreThan5 = false;
    public sendScheduled = false;
    public readonly = false;
    public addLink = false;
    public justCreated = false;
    public firstRun = true;
    public showPreview = false;

    public mail: any = {
        content: '',
        scheduled_at: moment().toISOString(),
        subject: '',
        attachments: {},
    };
    public mailCopy = { ...this.mail };
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

    public attachments = [];
    public validationErrors: any = [];
    public validationErrorName = '';
    public linkName = '';
    public linkAttachment = '';
    public scheduledDate = '';
    public date = null;
    public time = null;
    public title = '';
    public langs = LANGS;
    public lang = LANG_MAP[localStorage.getItem('lang') || 'en'] || LANGS[1];
    public langMap = {
        cat: 'ca',
        en: 'en',
        es: 'es',
    };
    @ViewChild(CreateDelivery, { static: true }) public createDelivery: CreateDelivery;

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
        this.route.queryParams
            .subscribe((queryParams) => {
                if (queryParams.acc_id || queryParams.attach) {
                    if (queryParams.concept) {
                        this.mail.concept = queryParams.concept;
                    }
                    if (queryParams.content) {
                        this.mail.content = queryParams.content;

                        this.createMail(true)
                            .then((resp) => {
                                this.saved = true;
                                this.justCreated = true;
                                if (queryParams.acc_id) {
                                    this.createDelivery.id = this.id;
                                    this.createDelivery.createDelivery([{ id: queryParams.acc_id }]);
                                }
                                if (queryParams.attach === 'b2b_report') {
                                    this.addAttachment('b2b_report', 'b2b_report.pdf');
                                }
                            });
                    }
                }
            }, (error) => {
                console.log(error);
            });

        this.lang[this.lang.abrev] = LANG_MAP[this.us.userData.locale];
        translate.onLangChange.subscribe(() => {
            this.update();
        });

        this.refreshInterval = setInterval(this.update.bind(this), 15e3);
    }

    public ngOnDestroy() {
        clearInterval(this.refreshInterval);
    }

    /**
     * Below methods are to disable navigation if not saved or item is empty
     * And will show a confirmation modal if return -> false, and will navigate if return -> true
     */
    @HostListener('window:beforeunload')
    public canDeactivate(): any {
        this.title = this.mail.subject;
        return (
            (this.justCreated) ||
            (this.mail.status === 'processed') ||
            (this.justCreated ? this.justCreated = true : this.saved) &&
            (this.mail.subject || this.mail.content)
        );
    }

    public onDiscard() {
        if (!this.mail.concept && !this.mail.content && !this.mail.id) {
            this.alerts.showSnackbar('Discarded changes');
        }
    }

    public onSaveDraft() {
        this.isEdit ? this.saveMail() : this.createMail(false);
    }

    public ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.id_or_new === 'new') { this.createMail(); }
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

    public async update() {
        if (!this.saved) {
            await this.saveMail();
        }

        this.getMail();
        this.search();
    }

    public getMail() {
        this.mailing.find(this.id, this.langMap[this.lang.abrev])
            .subscribe((resp) => {
                this.mail = resp.data;
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

    public getMailStatusColor(status) {
        switch (status) {
            case MailingCrud.STATUS_CREATED: return 'info';
            case MailingCrud.STATUS_PROCESSED: return 'info';
            case MailingCrud.STATUS_SCHEDULED: return 'warning';
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
        return this.mailing.update(this.id, data, this.langMap[this.lang.abrev])
            .toPromise().then((resp) => {
                this.alerts.showSnackbar(message);
                this.loading = false;
                this.saved = true;
                this.mail = resp.data;
                this.mailCopy = Object.assign({}, this.mail);
                this.update();
            }).catch((err) => {
                this.alerts.showSnackbar(err.message);
                this.loading = false;
            });
    }

    public saveMail({ goBack } = { goBack: false }) {
        this.loading = true;
        const data: any = Object.assign({}, this.mail);
        return this.updateMail({
            content: data.content,
            scheduled_at: moment(data.scheduled_at).toISOString(),
            subject: data.subject,
        }).then((res) => {
            this.saved = true;
            if (goBack) { this.router.navigate(['/rec/mailing']); }
        });
    }

    public createMail(navigateToMailing = true) {
        this.loading = true;
        const data: any = Object.assign({}, this.mail);
        return this.mailing.create({
            content: data.content,
            scheduled_at: new Date(data.scheduled_at).toISOString(),
            subject: data.subject,
        }, this.langMap[this.lang.abrev])
            .toPromise()
            .then((resp) => {
                this.alerts.showSnackbar('Created Mail Correctly');
                this.loading = false;
                this.isEdit = true;
                this.id = resp.data.id;
                this.justCreated = true;

                if (navigateToMailing) {
                    this.router.navigate(['/rec/mailing/' + this.id]);
                }
            }).catch((err) => {
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
        const attachments = Object.assign(this.mail.attachments, { [fname]: file });

        this.mailing.addAttachment(this.id, attachments, 'en')
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
        const now2 = this.mail.scheduled_at ? moment(this.mail.scheduled_at).toDate() : new Date();
        const parts = this.utils.parseDateToParts(now2);
        this.date = parts.dateStr;
        this.time = parts.timeStr;
        this.sendScheduled = true;
    }

    public closeScheduled() {
        this.sendScheduled = false;
    }

    public sendNormal(date = null, message = 'Scheduled mail correctly') {
        const mailData = {
            scheduled_at: (date ? moment(date) : moment()).toISOString(),
            status: MailingCrud.STATUS_SCHEDULED,
        };

        const send = () => this.updateMail(mailData, message).then(() => {
            this.justCreated = true;
            this.router.navigate(['/rec/mailing']);
        });

        if (!this.saved) {
            this.saveMail().then(send);
        } else {
            send();
        }
    }

    public createScheduled() {
        this.sendNormal(new Date(this.date + ' ' + this.time), 'Scheduled mail correctly');
        this.sendScheduled = false;
    }

    public selectLang(lang) {
        if (!this.saved) {
            this.saveMail().then((res) => {
                this.lang = lang;
                this.update();
            });
        } else {
            this.lang = lang;
            this.update();
        }
    }
}
