import { Injectable } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Challenge } from '../../../shared/entities/challenge.ent';
import { RecLang, REC_LANGS } from 'src/types';

@Injectable()
export class ChallengeCrud extends CrudBaseService<Challenge> {
    constructor(
        http: HttpClient,
        public us: UserService,
    ) {
        super(http, us);
        this.basePath = '/challenges';
        this.exportPath = '/account_challenges';
    }

    public addBadge(data: any, challengeId: string,  lang: RecLang = REC_LANGS.EN ){
        const url = [...this.getUrlBase(),'/', challengeId, '/', 'badges'];
        return this.post(
            url,
            data,
            'application/json',
            lang ? { 'Content-Language': lang, 'Accept-Language': lang } : null,
          ).pipe(this.itemMapper());
    }

    public deleteBadge(challengeId: any, badgeId: any){
        const url = [...this.getUrlBase(),'/', challengeId, '/', 'badges', '/', badgeId];
        return this.delete(url);
    }


    public mapper(item) {
        return item;
    }
}