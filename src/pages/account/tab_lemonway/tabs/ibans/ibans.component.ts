import { Component, Input } from '@angular/core';
import { TablePageBase } from 'src/bases/page-base';
import { ControlesService } from 'src/services/controles/controles.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { AddIbanDia } from 'src/dialogs/entities/add-iban/add-iban.dia';
import { EventsService } from 'src/services/events/events.service';

@Component({
    selector: 'lw-ibans-tab',
    templateUrl: './ibans.html',
})
export class LwTabIbans extends TablePageBase {
    @Input() public id = '';
    public withdrawals = [];
    public lwInfo: any = {};
    public pageName = 'Lemonway';
    public loading = true;
    constructor(
        public controles: ControlesService,
        public router: Router,
        public ls: LoginService,
        public titleService: Title,
        public alerts: AlertsService,
        public accCrud: AccountsCrud,
        public route: ActivatedRoute,
        public events: EventsService,
    ) {
        super();

        this.events.registerEvent('ibans:new')
            .subscribe((...args) => this.newIBAN());
    }

    public ngOnInit() {
        this.search();
    }

    public search() {
        this.getIbans();
    }

    public newIBAN() {
        return this.alerts.openModal(AddIbanDia, {
            id: this.id,
        }).subscribe((resp) => {
            this.search();
        });
    }

    public getIbans() {
        this.accCrud.getIbans(this.id)
            .subscribe(
                (resp) => {
                    console.log('resp', resp);
                },
                (error) => {
                    console.log('error', error);
                },
            );
    }
}