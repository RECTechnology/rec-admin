import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { TableListHeaderOptions } from "src/components/scaffolding/table-list/tl-header/tl-header.component";
import { TableListOptions, TlHeader, TlItemOption } from "src/components/scaffolding/table-list/tl-table/tl-table.component";
import { TlHeaders } from "src/data/tl-headers";
import { LoginService } from "src/services/auth/auth.service";
import { TablePageBase } from '../../../bases/page-base';
import { AddChallengeDia } from '../../../dialogs/challenges/add-challenge/add-challenge.dia';
import { MatDialog } from '@angular/material/dialog';
import { ChallengeCrud } from '../../../services/crud/challenges/challenges.crud';
import { TlItemOptions } from "src/data/tl-item-options";
import { Sort } from "@angular/material/sort";
import { AlertsService } from "src/services/alerts/alerts.service";
import { ExportDialog } from "src/dialogs/other/export-dialog/export.dia";
import { AccountChallengesExportDefaults } from '../../../data/export-defaults';

@Component({
    selector: 'challenges_tab',
    templateUrl: './tab_challenges.html',
})

export class ChallengesTab extends TablePageBase {
    public pageName = 'Challenges';
    public sortID: string = 'status';
    public validationErrors: any[] = [];
    public defaultExportKvp = AccountChallengesExportDefaults;
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
            title: 'Title',
            accessor: 'title',
            sortable: false
        },
        {
            accessor: (v) => (v.token_reward ? v.token_reward.id : {}),
            title: 'Reward',
            sortable: false,
            type: 'code',
            tooltip: (v) => (v.token_reward ? v.token_reward.name : {})
        },
        TlHeaders.Status,
        {
            title: 'Start_Date',
            accessor: 'start_date',
            sort: 'start_date',
            type:'date'
        },
        {
            title: 'End_Date',
            accessor: 'finish_date',
            sort: 'finish_date',
            type:'date'
        },
    ]

    constructor(
            public ls: LoginService,
            public titleService: Title,
            public router: Router,
            public dialog: MatDialog,
            public crud: ChallengeCrud,
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
        const dialogRef = this.dialog.open(AddChallengeDia);
        dialogRef.afterClosed().subscribe((challenge) => {
            if (challenge) {
                this.alerts.showSnackbar('Reto creado correctamente!');
                this.search();
            }
        });
    }

    public editItem( challengeItem ) {
        const dialogRef = this.dialog.open(AddChallengeDia);
        dialogRef.componentInstance.challenge = challengeItem;
        dialogRef.componentInstance.isEdit = true;
        dialogRef.afterClosed().subscribe((challenge) => {
            if (challenge) {
                this.alerts.showSnackbar('Reto editado correctamente!');
                this.search();
            }
        });
    }

    public deleteItem(item: any) {
        if (this.loading) {
            return;
        } 

        this.alerts.confirmDeletion('challenge', `(${item.title || item.name || ""})`, true)
            .subscribe((confirm) => {
                if (!confirm) {
                    this.loading = false;
                    return;
                }

                this.loading = true;
                this.crud.remove(item.id)
                    .subscribe((resp) => {
                        this.alerts.showSnackbar('Removed challenge correctly!', 'OK');
                        this.search();
                    }, (err) => {
                        this.alerts.showSnackbar(err.message, 'ok');
                        this.loading = false;
                    });
            });
    }

    public sortData(sort: Sort): void {
        if (!sort.active || sort.direction === '') {
          this.sortedData = this.data.slice();
          this.sortID = this.sortID;
          this.sortDir = 'desc';
        } else {
          this.sortID = sort.active;
          this.sortDir = sort.direction;
        }
        this.addToQueryParams({
          sortId: this.sortID,
          sortDir: this.sortDir,
        });
        this.search();
      }

    public export() {
        return this.alerts.openModal(ExportDialog, {
            defaultExports: [...this.defaultExportKvp],
            entityName: 'AccountChallenge',
            fn: this.crud.exportEmail.bind(this.crud),
            list: [...this.defaultExportKvp]
          });
    }
}