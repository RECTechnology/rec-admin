import { Component } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'b2b-settings',
    templateUrl: './settings.html',
})
export class B2BSettingsComponent {
    public tab: string = '';
    public currentTab = 0;
    public tabMap = {
        neighborhoods: 0,
        // tslint:disable-next-line: object-literal-sort-keys
        activities: 1,
        products: 2,
        0: 'neighborhoods',
        1: 'activities',
        2: 'products',
    };

    constructor(
        public controles: ControlesService,
        public route: ActivatedRoute,
        public router: Router,
    ) {
        this.route.queryParams
            .subscribe((params) => {
                this.tab = params.tab || 'neighborhoods';
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
