import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { CampaignsCrud } from 'src/services/crud/campaigns/campaigns.service';
import { Campaign } from 'src/shared/entities/campaign.ent';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { CompanyService } from 'src/services/company/company.service';

@Component({
  selector: 'tab-campaigns',
  templateUrl: './campaigns.html',
})
export class CampaignsTab {
  static readonly tabName = 'campaigns';
  static readonly fields = ['campaign'];

  @Input() public id = '';
  @Input() public account: Account;
  @Input() public loading: boolean = false;
  @Output() public close: EventEmitter<any> = new EventEmitter();

  public pageName = 'CAMPAIGNS';
  public showV2Campaigns: boolean = false;
  public campaignsV1: Campaign[] = [];
  public campaignsV2: Campaign[] = [];
  public campaigns: Campaign[] = [];

  constructor(
    public campaignsService: CampaignsCrud,
    public accountsCrud: AccountsCrud,
    public snackbar: MySnackBarSevice,
    public companyService: CompanyService
  ) {}

  public ngOnInit() {
    this.getAllCampaigns();
    console.log(this.companyService.selectedCompany)
  }

  public getAllCampaigns() {
    this.loading = true;
    this.campaignsService.list().subscribe(
      (resp) => {
        this.campaigns = resp.data.elements;
        this.loading = false;
        this.manageCampaigns(this.campaigns);
      },
      (err) => {
        this.loading = false;
      },
    );
  }

  public isAccountInCampaign(outterCampaign){
    return this.companyService.selectedCompany.campaigns ? 
      this.companyService.selectedCompany.campaigns.some(campaign => campaign.id === outterCampaign.id) : false;
  }

  public manageCampaigns(campaigns){
    this.campaignsV1 = campaigns.filter(campaign => campaign.version === 0);
    this.campaignsV2 = campaigns.filter(campaign => campaign.version !== 0);
  }

  public isCampaignActiveForAccount(campaign: Campaign): boolean {
    return this.account.isCampaignActive(campaign);
  }

  public toggleCampaign(campaign: Campaign) {
    const isActive = this.isCampaignActiveForAccount(campaign);

    this.loading = true;
    if (!isActive) {
      this.accountsCrud.addCampaing(this.account.id, campaign.id).subscribe((resp) => {
        this.snackbar.open('ENABLED_CAMPAIGN');
        this.loading = false;
        this.account.campaigns.push(campaign);
      }, this.onError.bind(this));
    } else {
      this.accountsCrud.deleteCampaing(this.account.id, campaign.id).subscribe((resp) => {
        this.snackbar.open('DISABLED_CAMPAIGN');
        this.loading = false;
        this.removeCampaign(campaign);
      }, this.onError.bind(this));
    }
  }

  public removeCampaign(campaign) {
    const index = this.account.campaigns.indexOf(campaign);
    this.account.campaigns.splice(index, 1);
  }

  public onError(err) {
    this.snackbar.open(err.message);
    this.loading = false;
  }
}
