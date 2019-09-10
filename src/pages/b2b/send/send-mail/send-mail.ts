import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { ActivatedRoute } from '@angular/router';
import { ControlesService } from 'src/services/controles/controles.service';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';
import { CreateDelivery } from '../create-delivery/create-delivery';

@Component({
    selector: 'send-mail',
    templateUrl: './send-mail.dia.html',
})
export class SendMail {
    public blured = false;
    public focused = false;
    public saved = false;

    public mail = {
        content: '',
        subject: '',
    };

    public mailCopy = {
        content: '',
        subject: '',
    };

    public isEdit = false;
    public id = null;

    public deliveries = [];

    constructor(
        public us: UserService,
        public translate: TranslateService,
        public mailDeliveries: MailingDeliveriesCrud,
        public snackbar: MySnackBarSevice,
        public route: ActivatedRoute,
        public controls: ControlesService,
        public mailing: MailingCrud,
        public dialog: MatDialog,
    ) {

    }

    public ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.id_or_new && params.id_or_new !== 'new' && /[0-9]+/.test(params.id_or_new)) {
                this.isEdit = true;
                this.id = params.id_or_new;
                this.getMail();
                this.getDeliveries();
            } else {
                this.mailCopy = Object.assign({}, this.mail);
            }
        });
    }

    public getMail() {
        this.mailing.find(this.id)
            .subscribe((resp) => {
                this.mail = resp.data;
                this.mailCopy = Object.assign({}, this.mail);
            });
    }

    public getDeliveries() {
        this.mailDeliveries.search({ mailing_id: this.id })
            .subscribe((resp) => {
                console.log('deliveries', resp);
            });
    }

    public createDelivery() {
        const ref = this.dialog.open(CreateDelivery);
        ref.componentInstance.id = this.id;
        ref.afterClosed()
            .subscribe((resp) => {
                console.log('createDelivery::afterClosed', this.id);
                console.log(resp);
            });
    }

    public updateMail() {
        const data: any = Object.assign({}, this.mail);
        this.mailing.update(this.id, { subject: data.subject, content: data.content })
            .subscribe((resp) => {
                this.snackbar.open('Edited Mail Correctly');
            });
    }

    public isSaveDisabled() {
        return this.mail.subject === this.mailCopy.subject && this.mail.content === this.mailCopy.content;
    }

    public created(event) {
        console.log('editor-created', event);
    }

    public changedEditor(event) {
        console.log('editor-change', event);
        this.mail.content = event.html ? event.html : this.mail.content;
    }

    public focus($event) {
        console.log('focus', $event);
        this.focused = true;
        this.blured = false;
    }

    public blur($event) {
        console.log('blur', $event);
        this.focused = false;
        this.blured = true;
    }
}
