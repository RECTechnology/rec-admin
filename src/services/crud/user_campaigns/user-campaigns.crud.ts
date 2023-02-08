import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { ListAccountsParams } from 'src/interfaces/search';

@Injectable()
export class CampaignUsersCrud extends CrudBaseService<any> {
    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
        this.version = 'v1';
        this.basePath = '';
    }

    public mapper(item) {
        return item;
    }

    public getCampaignUsers(campaign_id: number, data: ListAccountsParams = {}): any{
        this.basePath = `/campaign/${campaign_id}/users`;
        const url = [...this.getUrlBase()];
        return this.get(url, data).pipe(this.itemMapper());
    }

    public exportCampaignUsers(campaign_id: number): any{
        this.basePath = `/campaign/${campaign_id}/users`;
        const url = [...this.getExportUrlBase()];
        return this.get(url).pipe(this.itemMapper());
    }
}