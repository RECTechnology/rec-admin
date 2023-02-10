import { Component, OnInit, OnDestroy, AfterViewInit, AfterContentInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountCampaignsCrud } from '../../../services/crud/account_campaigns/account-campaigns.crud';
import { CampaignsCrud } from '../../../services/crud/campaigns/campaigns.service';
import { theme } from 'src/theme/theme';
import { UsersCrud } from 'src/services/crud/users/users.crud';
import { TablePageBase } from '../../../bases/page-base';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { TableListOptions, TlHeader } from '../../../components/scaffolding/table-list/tl-table/tl-table.component';
import { LoginService } from 'src/services/auth/auth.service';
import { TableListHeaderOptions } from 'src/components/scaffolding/table-list/tl-header/tl-header.component';
import { CampaignUsersCrud } from '../../../services/crud/user_campaigns/user-campaigns.crud';
import { ExportCampaignsUsers } from '../../../dialogs/campaigns/export-campaigns/export-campaigns.dia';
import { MatDialog } from '@angular/material/dialog';
import { AccountsCrud } from '../../../services/crud/accounts/accounts.crud';
import { CompanyService } from 'src/services/company/company.service';
import { AlertsService } from 'src/services/alerts/alerts.service';


declare const Morris;
@Component({
    selector: 'campaign',
    templateUrl: './campaign.html',
    styleUrls: ['./campaign.scss']
  })
  

  export class CampaignComponent extends TablePageBase implements OnInit, OnDestroy {

    public filters: any = null;
    public totalUsers: number = null;
    public totalUsersOnCampaign: number = 0;
    public totalUsersNotInCampaign: number = 0;
    public totalAccumulatedBonus: number = 0;
    public totalSpentBonus: number = 0;
    public donutParticipantsData: any = null;
    public donutBonificationsData: any = null;
    public campaign: any = null;
    public regColors = theme.regColors;
    public loading: boolean = false;
    public showDonut: boolean = false;
    public pageName = 'Campaign';
    public campaign_id: number = null;
    public managerAccountBalance: number = 0;
    public tab: string = '';
    public subscriptionParams: Subscription;
    public screenWindow: Window;
    public allUsersSubscription: Subscription;
    public campaignSubscription: Subscription;
    public getCampaigUsersSubscription: Subscription;
    public getAccountManagerSubscription: Subscription;

    public headerOpts: TableListHeaderOptions = { input: true, refresh: true, deepLinkQuery: false };

    public tableOptions: TableListOptions = {
      optionsType: 'buttons',
      onClick: (entry) => this.viewUser(entry),
    };
   

    constructor( 
        public ls: LoginService,
        public route: ActivatedRoute,
        public accountsCampaignCrud: AccountCampaignsCrud,
        public campaignsCrud: CampaignsCrud,
        public usersCrud: UsersCrud,
        public titleService: Title,
        public translate: TranslateService,
        public router: Router,
        public campaignUsersCrud: CampaignUsersCrud,
        public dialog: MatDialog,
        public accountsCrud: AccountsCrud,
        public companyService: CompanyService,
        public alerts: AlertsService){
      super(router, translate);
    }

    public headers: TlHeader[] = [
      {
        title: 'ID',
        accessor: 'id',
        sort: 'id',
        sortable: false
      },
      {
        title: 'Name',
        accessor: 'name',
        sort: 'name',
        sortable: false
      },
      {
        title: 'User',
        accessor: 'username',
        sort: 'username',
        sortable: false,
        type: 'code'
      },
      {
        title: 'Phone',
        accessor: 'phone',
        sort: 'phone',
        sortable: false
      },
      {
        title: 'BONUS_OBTAINED',
        suffix: 'R',
        accessor: (el) => el.accumulated_bonus ? 
        this.convertToRecs(el.accumulated_bonus) : 0,
        sort: 'accumulated_bonus',
        sortable: false
      },
      {
        title: 'BONUS_SPENT',
        accessor: (el) => el.spent_bonus ? 
        this.convertToRecs(el.spent_bonus) : 0,
        sort: 'spent_bonus',
        suffix: 'R',
        sortable: false
      }
    ]

    ngOnInit(): void {
    
    this.subscriptionParams = this.route.params.subscribe((params) => {
      this.campaign_id = params.id;
      this.filters = {'campaign_id': this.campaign_id};
      this.pageName = 'Campaign (' + this.campaign_id + ')';
    });
    this.screenWindow = window;
    console.log(window.innerWidth)
    console.log(window.innerHeight)
    }

    public ngOnDestroy() {
        this.subscriptionParams.unsubscribe();
        this.allUsersSubscription.unsubscribe();
        this.campaignSubscription.unsubscribe();
        this.getCampaigUsersSubscription.unsubscribe();
        this.getAccountManagerSubscription.unsubscribe();
    }

    public search(query?: string) {
      this.loading = true;

      this.getCampaigUsersSubscription = this.campaignUsersCrud.getCampaignUsers(this.campaign_id, 
        {
          order: this.sortDir,
          limit: this.limit,
          offset: this.offset,
          sort: this.sortID,
          search: query,
        })
        .subscribe( respCampaignUsers => {
          this.allUsersSubscription = this.usersCrud.list().subscribe((resp) => {
            this.totalUsers = resp.data.total;
            this.loadCampaign(respCampaignUsers);
            
          })
        }, error => {
          this.loading = false;
          this.alerts.observableErrorSnackbar(error)
        })
    }

    public loadCampaign(respCampaignUsers): void {
        this.loading = true;

        this.campaignSubscription = this.campaignsCrud.find(this.campaign_id).subscribe( resp =>{
            this.campaign = resp.data;
            this.getCampaignManager(resp.data.campaign_account, respCampaignUsers);
            if(this.campaign.version === 0){
              this.router.navigate([`/campaigns`]);
            }
        }, err => {
          this.loading = false;
          this.alerts.observableErrorSnackbar(err)
        })
    }

    public getCampaignManager(id: number, respCampaignUsers: any) {
      this.loading = true;

      this.getAccountManagerSubscription = this.accountsCrud.find(id).subscribe( resp => {
        this.companyService.selectedCompany = resp.data;
        this.managerAccountBalance = this.companyService.selectedCompany.getBalance(this.environment.crypto_currency || 'REC');
        this.manageCampaignData(respCampaignUsers);
      }, err => {
        this.loading = false;
        this.alerts.observableErrorSnackbar(err)
      })

    }

    public manageCampaignData(resp: any) {
      this.sortedData = resp.data.elements;
          this.totalAccumulatedBonus = resp.data.total_accumulated_bonus;
          this.totalUsersOnCampaign = resp.data.total;
          this.totalUsersNotInCampaign = this.totalUsers - this.totalUsersOnCampaign;
          this.donutParticipantsData = [
            { label: '', value: this.totalUsersOnCampaign },
            { label: '', value: this.totalUsersNotInCampaign },
          ],
          this.donutBonificationsData = [
            { label: '', value: this.totalAccumulatedBonus },
            { label: '', value: this.managerAccountBalance },
          ]
          this.updateDonutParticipantsChart(this.donutParticipantsData, this.totalUsers);
          this.updateDonutBonificationsChart(
            this.convertToRecs(this.donutBonificationsData), 
            (this.convertToRecs(this.totalAccumulatedBonus) + this.managerAccountBalance
          ));

          this.loading = false;
    }
    

    public updateDonutParticipantsChart(data?, total?) {
      document.getElementById('campaign-participants-donut').innerHTML = '';
      const donut = new Morris.Donut({
        colors: theme.regColors,
        data: data || [
          { label: '', value: this.totalUsersOnCampaign },
          { label: '', value: this.totalUsersNotInCampaign },
        ],
        element: 'campaign-participants-donut',
        formatter: function (value, data) { return (value/total *100).toFixed(2) + '%'; }
      });
  
      (window as any).addEventListener('resize', () => {
        donut.redraw();
      });
    }

    public updateDonutBonificationsChart(data? ,total?) {
      document.getElementById('campaign-bonus-donut').innerHTML = '';
      const donut = new Morris.Donut({
        colors: theme.regColors,
        data: data || [
          { label: '', value: this.convertToRecs(this.totalAccumulatedBonus) },
          { label: '', value: this.managerAccountBalance },
        ],
        element: 'campaign-bonus-donut',
        formatter: function (value, data) { return (value/total *100).toFixed(2) + '%' || 0; }
      });
  
      (window as any).addEventListener('resize', () => {
        donut.redraw();
      });
    }

    public export(){
      const ref = this.dialog.open(ExportCampaignsUsers);
      ref.componentInstance.campaign_id = this.campaign_id;
      return ref.afterClosed();
    }

    public convertToRecs(number: number){
      return number /1e8;
    }

    public viewUser(user, tab = 'details') {
      this.router.navigate([`/users/${user.id}`], { queryParams: { tab } });
    }

    
      public goBack() {
        this.router.navigate(['/campaigns']);
      }
  }