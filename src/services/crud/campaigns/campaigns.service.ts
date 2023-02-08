import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Campaign } from 'src/shared/entities/campaign.ent';

@Injectable()
export class CampaignsCrud extends CrudBaseService<Campaign> {
  constructor(http: HttpClient, public us: UserService) {
    super(http, us);
    this.basePath = '/campaigns';
    this.mapItems = true;
    this.version = 'v3';
  }

  public mapper(item) {
    return new Campaign(item);
  }
}
