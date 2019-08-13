import { Component } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { B2bService } from 'src/services/b2b/b2b.service';
import { MySnackBarSevice } from 'src/bases/snackbar-base';

@Component({
    selector: 'b2b-settings',
    templateUrl: './settings.html',
})
export class B2BSettingsComponent {
    public tab: string = '';
    public currentTab = 0;
    public tabMap = {
        activities: 0,
        products: 1,
        // tslint:disable-next-line: object-literal-sort-keys
        neighborhoods: 2,
        0: 'activities',
        1: 'products',
        2: 'neighborhoods',
    };

    constructor(
        public controles: ControlesService,
        public route: ActivatedRoute,
        public router: Router,
        public dialog: MatDialog,
        public b2b: B2bService,
        public snackbar: MySnackBarSevice,
    ) {
        this.route.queryParams
            .subscribe((params) => {
                this.tab = params.tab || 'activities';
                this.currentTab = this.tabMap[this.tab] || 0;
            });
    }

    /* Called when tab change, so url changes also */
    public changeUrl($event) {
        this.router.navigate(['/b2b/settings'], {
            queryParams: { tab: this.tabMap[$event] },
            queryParamsHandling: 'merge',
        });
    }
}
