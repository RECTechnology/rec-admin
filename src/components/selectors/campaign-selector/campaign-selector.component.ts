import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CampaignsCrud } from 'src/services/crud/campaigns/campaigns.service';
import { Campaign } from 'src/shared/entities/campaign.ent';
import { BaseSelectorComponent } from 'src/bases/base-selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'campaign-selector',
  templateUrl: './campaign-selector.html',
})
export class CampaignSelector extends BaseSelectorComponent {
  public campaigns: Campaign[];
  public error: string;

  @Input() public value: any = '';
  @Input() public disabled: boolean = false;
  @Output() public valueChange = new EventEmitter<string>();

  constructor(protected campaignsService: CampaignsCrud) {
    super()
  }

  public getSearchObservable(query: string): Observable<any> {
    return this.campaignsService
      .search({
        search: query,
        sort: 'name',
        dir: 'asc',
        limit: 100
      })
      .pipe(
        map((resp) => {
          return resp.data.elements;
        }),
      );
  }
}
