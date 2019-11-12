import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CompanyService } from '../../../services/company/company.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { B2bService } from 'src/services/b2b/b2b.service';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lemonway-tab',
  templateUrl: './lemonway.html',
})
export class LemonWayTab {
  constructor(
    public b2bCrud: B2bService,
    public crudAccounts: AccountsCrud,
    public utils: UtilsService,
    public cs: CompanyService,
    public us: UserService,
    public translate: TranslateService,
  ) { }
}
