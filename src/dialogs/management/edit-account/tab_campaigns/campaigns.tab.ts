import { EventsService } from 'src/services/events/events.service';
import { AdminService } from 'src/services/admin/admin.service';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ControlesService } from 'src/services/controles/controles.service';
import { LoginService } from 'src/services/auth/auth.service';
import { Pos } from 'src/shared/entities/pos.ent';
import { CompanyService } from 'src/services/company/company.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { Account } from 'src/shared/entities/account.ent';
import { CampaignsCrud } from 'src/services/crud/campaigns/campaigns.service';
import { Campaign } from 'src/shared/entities/campaign.ent';

@Component({
  selector: 'campaigns-tab',
  templateUrl: './campaigns.html',
})
export class CampaignsTab {
  @Input() public id = '';
  @Input() public account: Account;

  public pageName = 'CAMPAIGNS';
  public loading = true;
  public campaigns: Campaign[] = [
    new Campaign({
      name: 'test',
      init_date: '1/10/2020',
      end_date: '10/2/2020',
    }),
    new Campaign({
      name: 'test',
      init_date: '1/10/2020',
      end_date: '20/10/2020',
    }),
  ];

  constructor(public campaignsService: CampaignsCrud) {}

  public ngOnInit() {
    this.account.campaigns = [this.campaigns[1]];
    this.getAllCampaigns();
  }

  public getAllCampaigns() {
    this.campaignsService.list().subscribe(
      (resp) => {
        this.campaigns = resp.data;
      },
      (err) => {
        console.log(err);
      },
    );
  }

  public isCampaignActiveForAccount(campaign: Campaign): boolean {
    return this.account.isCampaignActive(campaign);
  }

  public activateCampaign(campaign: Campaign) {
    // TODO
  }
}
