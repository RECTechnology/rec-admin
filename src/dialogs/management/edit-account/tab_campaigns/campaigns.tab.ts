import { Component, Input } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { CampaignsCrud } from 'src/services/crud/campaigns/campaigns.service';
import { Campaign } from 'src/shared/entities/campaign.ent';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { MySnackBarSevice } from 'src/bases/snackbar-base';

@Component({
  selector: 'campaigns-tab',
  templateUrl: './campaigns.html',
})
export class CampaignsTab {
  @Input() public id = '';
  @Input() public account: Account;

  public pageName = 'CAMPAIGNS';
  public loading = true;
  public campaigns: Campaign[] = [];

  constructor(
    public campaignsService: CampaignsCrud,
    public accountsCrud: AccountsCrud,
    public snackbar: MySnackBarSevice,
  ) {}

  public ngOnInit() {
    this.getAllCampaigns();
  }

  public getAllCampaigns() {
    this.loading = true;
    this.campaignsService.list().subscribe(
      (resp) => {
        console.log({ resp });
        this.campaigns = resp.data.elements;
        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      },
    );
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
      }, this.onError.bind(this));
    } else {
      this.accountsCrud.deleteCampaing(this.account.id, campaign.id).subscribe((resp) => {
        this.snackbar.open('DISABLED_CAMPAIGN');
        this.loading = false;
      }, this.onError.bind(this));
    }
  }

  public onError(err) {
    console.log(err);
    this.snackbar.open(err.message);
    this.loading = false;
  }
}
