import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CampaignsCrud } from 'src/services/crud/campaigns/campaigns.service';
import { Campaign } from 'src/shared/entities/campaign.ent';

@Component({
  selector: 'campaign-selector',
  templateUrl: './campaign-selector.html',
})
export class CampaignSelector implements OnInit {
  public campaigns: Campaign[];
  public error: string;

  @Input() public value: any = '';
  @Input() public disabled: boolean = false;
  @Output() public valueChange = new EventEmitter<string>();

  constructor(protected campaignsService: CampaignsCrud) {}

  public ngOnInit() {
    this.search();
  }

  public search() {
    this.campaignsService.list({ limit: 100 }).subscribe(
      (resp) => {
        this.campaigns = resp.data.elements;
      },
      (err) => {
        this.error = err;
      },
    );
  }
}
