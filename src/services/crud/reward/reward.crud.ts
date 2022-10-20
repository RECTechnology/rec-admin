import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Reward } from '../../../shared/entities/reward.ent';

@Injectable()
export class RewardsCrud extends CrudBaseService<Reward> {
    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
        this.basePath = '/token_rewards';
    }

    public mapper(item) {
        return item;
    }
}