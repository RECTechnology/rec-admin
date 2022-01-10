import { UtilsService } from 'src/services/utils/utils.service';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { Tier } from 'src/shared/entities/tier.ent';
import { TiersCrud } from 'src/services/crud/tiers/tiers.crud';

@Component({
  selector: 'tab-basic-info',
  templateUrl: './basic_info.html',
})
export class BasicInfoTab implements OnInit {
  @Input() public id = '';
  @Input() public account: Account;
  @Input() public loading: boolean = false;
  @Output() public accountChanged: EventEmitter<Partial<Account>> = new EventEmitter();

  public accountCopy: any = {};
  public tiers: Tier[] = [];
  public error: string;
  public pageName = 'BASIC_INFO';

  public ACCOUNT_TYPES = Account.ACCOUNT_TYPES;
  public ACCOUNT_SUB_TYPES_COMPANY = Account.ACCOUNT_SUB_TYPES_COMPANY;
  public ACCOUNT_SUB_TYPES_PRIVATE = Account.ACCOUNT_SUB_TYPES_PRIVATE;

  constructor(private tiersCrud: TiersCrud, private utils: UtilsService) {}

  public ngOnInit() {
    this.accountCopy = { ...this.account };
    this.getTiers();
  }

  public getTiers() {
    this.tiersCrud.list().subscribe((res) => {
      this.tiers = res.data.elements.map((el) => {
        return {
          value: el.id,
          name: el.code,
        };
      });
    });
  }

  public setType(type) {
    this.accountCopy.type = type;
    if (type === 'COMPANY') {
      this.accountCopy.subtype = this.ACCOUNT_SUB_TYPES_COMPANY[0];
    } else if (type === 'PRIVATE') {
      this.accountCopy.subtype = this.ACCOUNT_SUB_TYPES_PRIVATE[0];
    }
  }

  public update() {
    const changedProps: any = this.utils.deepDiff(this.accountCopy, this.account);
    console.log("Im in update accountCopy",this.accountCopy);
    console.log("Im in update accountCopy",this.account);
    delete changedProps.activity_main;
    delete changedProps.kyc_manager;
    delete changedProps.schedule;
    delete changedProps.level;
    delete changedProps.pos;
    this.accountChanged.emit(changedProps);
  }
}
