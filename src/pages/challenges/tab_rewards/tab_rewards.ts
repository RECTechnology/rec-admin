import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { TablePageBase } from "src/bases/page-base";
import { TableListHeaderOptions } from "src/components/scaffolding/table-list/tl-header/tl-header.component";
import { TableListOptions, TlHeader, TlItemOption } from "src/components/scaffolding/table-list/tl-table/tl-table.component";
import { TlHeaders } from "src/data/tl-headers";
import { TlItemOptions } from "src/data/tl-item-options";
import { LoginService } from "src/services/auth/auth.service";
import { RewardsCrud } from '../../../services/crud/reward/reward.crud';
import { AddRewardsDia } from '../../../dialogs/challenges/add-reward/add-reward.dia';
import { AlertsService } from '../../../services/alerts/alerts.service';

@Component({
    selector: 'rewards_tab',
    templateUrl: './tab_rewards.html',
})

export class RewardsTab extends TablePageBase {
    public pageName = 'Rewards';
    public validationErrors: any[] = [];
    public headerOpts: TableListHeaderOptions = { input: false, refresh: true, deepLinkQuery: false };
    public tableOptions: TableListOptions = {
        optionsType: 'buttons',
    };
    public itemOptions: TlItemOption[] = [
        TlItemOptions.Edit(this.editItem.bind(this)),
        TlItemOptions.Delete(this.deleteItem.bind(this)),
    ];  
    public headers: TlHeader[] = [
        TlHeaders.Id,
        {
            title: 'Name',
            accessor: 'name',
            sortable: false
        },
        {
            title: 'Challenge',
            accessor: (v) => (v.challenge ? v.challenge.id : '-'),
            sortable: false,
            type: 'code',
            tooltip: (v) => (v.challenge ? v.challenge.title : null)
        },
    ]


    constructor(
            public ls: LoginService,
            public titleService: Title,
            public router: Router,
            public dialog: MatDialog,
            public crud: RewardsCrud,
            public alerts: AlertsService
        ){
            super(router);
    }

    public search(query?: string) {
        this.loading = true;
        this.crud
            .search({
                order: this.sortDir,
                limit: this.limit,
                offset: this.offset,
                sort: this.sortID
            },'all')
            .subscribe(
                (resp) => {
                    this.data = resp.data.elements;
                    this.sortedData = this.data.slice();
                    this.total = resp.data.total;
                    this.loading = false;
                  },
                  (error) => {
                    this.validationErrors = error.errors;
                    this.loading = false;
                  },
            );
    }   
    
    public addItem() {
        const dialogRef = this.dialog.open(AddRewardsDia);
        dialogRef.afterClosed().subscribe((reward) => {
            if (reward) {
                this.alerts.showSnackbar('Premio creado correctamente!');
                this.search(); 
            }
        });
    }

    public editItem(rewardItem) {
        if(rewardItem.challenge && rewardItem.challenge.status !== 'scheduled'){
            this.alerts.showSnackbar('REWARD_EDIT_ADVISE');
            return;
        }
        const dialogRef = this.dialog.open(AddRewardsDia);
        dialogRef.componentInstance.reward = rewardItem;
        dialogRef.componentInstance.isEdit = true;
        dialogRef.afterClosed().subscribe((reward) => {
            if (reward) {
                this.alerts.showSnackbar('Premio editado correctamente!');
                this.search();
            }
        });
    }

    public deleteItem(item: any) {
        if (this.loading) {
            return;
        }

        this.alerts.confirmDeletion('Reward', `(${item.title || item.name || ""})`, true, 'CONFIRM_DELETE_REWARD')
            .subscribe((confirm) => {
                if (!confirm) {
                    this.loading = false;
                    return;
                }

                this.loading = true;
                this.crud.remove(item.id)
                    .subscribe((resp) => {
                        this.alerts.showSnackbar('Removed challenge correctly!', 'OK');
                        this.loading = false;
                        this.search();
                    }, (err) => {
                        this.alerts.showSnackbar(err.message, 'ok');
                        this.loading = false;
                    });
            });
    }
}       