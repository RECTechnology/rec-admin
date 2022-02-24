import { Component } from '@angular/core';
import { ControlesService } from 'src/services/controles/controles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageBase } from 'src/bases/page-base';
import { LoginService } from 'src/services/auth/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'b2b-settings',
    templateUrl: './settings.html',
})
export class B2BSettingsComponent extends PageBase {
    public pageName = 'Entities';
    public tab: string = '';
    public currentTab = 0;
    public tabMap = {
        activities: 0,
        products: 1,
        neighborhoods: 2,
        document_kinds: 3,
        documents: 4,
        tiers: 5,
        0: 'activities',
        1: 'products',
        2: 'neighborhoods',
        3: 'document_kinds',
        4: 'documents',
        5: 'tiers',
    };

    constructor(
        public controles: ControlesService,
        public route: ActivatedRoute,
        public router: Router,
        public ls: LoginService,
        public titleService: Title,
    ) {
        super();
        this.route.queryParams
            .subscribe((params) => {
                this.tab = params.tab || 'activities';
                this.currentTab = this.tabMap[this.tab] || 0;
                
            });
    }

    /* Called when tab change, so url changes also */
    public changeUrl($event) {
        this.pageName = this.tabMap[$event];
        this.setTitle(this.Brand.title + ' | ' + (this.pageName[0].toUpperCase() + (this.pageName.substr(1))));

        this.router.navigate(['/b2b/settings'], {
            queryParams: { tab: this.tabMap[$event], },
            // queryParamsHandling: '',
        });
    }
    
}
