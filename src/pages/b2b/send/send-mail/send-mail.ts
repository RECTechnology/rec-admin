import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { MailingDeliveriesCrud } from 'src/services/crud/mailing/mailing_deliveries.crud';
import { ActivatedRoute } from '@angular/router';
import { ControlesService } from 'src/services/controles/controles.service';
import { MailingCrud } from 'src/services/crud/mailing/mailing.crud';

@Component({
    selector: 'send-mail',
    styleUrls: ['./send-mail.scss'],
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

    public isEdit = false;
    public id = null;

    constructor(
        public us: UserService,
        public translate: TranslateService,
        public mailDeliveries: MailingDeliveriesCrud,
        public snackbar: MySnackBarSevice,
        public route: ActivatedRoute,
        public controls: ControlesService,
        public mailing: MailingCrud,
    ) {
        this.route.params.subscribe((params) => {
            console.log('params', params);
            if (params.id_or_new && params.id_or_new !== 'new' && /[0-9]+/.test(params.id_or_new)) {
                this.isEdit = true;
                this.id = params.id_or_new;
                this.getMail();
            }
        });
    }

    public getMail() {
        this.mailing.find(this.id)
            .subscribe((resp) => {
                this.mail = resp.data;
            });
    }

    public createMail() {
        this.mailing.create(Object.assign({}, this.mail))
            .subscribe((resp) => {
                this.snackbar.open('Created Mail Correctly');
            });
    }

    public updateMail() {
        const data: any = Object.assign({}, this.mail);
        this.mailing.update(this.id, { subject: data.subject, content: data.content })
            .subscribe((resp) => {
                this.snackbar.open('Edited Mail Correctly');
            });
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
