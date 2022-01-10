import { EventsService } from 'src/services/events/events.service';

import { Injectable, Inject } from '@angular/core';
import { CrudBaseService } from 'src/services/base/crud.base';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { CompanyService } from 'src/services/company/company.service';
import { RecLang, REC_LANGS } from 'src/types';
import { Account } from 'src/shared/entities/account.ent';
import * as moment from 'moment';
import { Iban } from 'src/shared/entities/iban.ent';

@Injectable()
export class OffersCrud extends CrudBaseService<Account> {
  public pdfHtml: string = '';
  @Inject(EventsService) public events: EventsService;

  constructor(http: HttpClient, public us: UserService, public cs: CompanyService) {
    super(http, us);
    this.basePath = '/offers';
    this.userRole = 'admin';
    this.mapItems = true;
  }

  public mapper(item) {
    return new Account(item);
  }


  public addOffer(account_id,data) {
    const url = [...this.getUrlBase()];
    return this.post(url,data).pipe(this.itemMapper());
  }

  public editOffer(offerId,data) {
    const url = [...this.getUrlBase(), '/', offerId ];
    return this.put(url,data);
  }

}
