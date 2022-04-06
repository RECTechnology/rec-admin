import { UtilsService } from 'src/services/utils/utils.service';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { Tier } from 'src/shared/entities/tier.ent';
import { TiersCrud } from 'src/services/crud/tiers/tiers.crud';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  public formGroup = new FormGroup({
    prefix: new FormControl(""),
    phone: new FormControl("", Validators.pattern(/^[0-9]*$/)),
    name: new FormControl(""),
    email: new FormControl("", Validators.email),
    cif: new FormControl("", [Validators.maxLength(9), Validators.pattern(/([a-z]|[A-Z]|[0-9])[0-9]{7}([a-z]|[A-Z]|[0-9])/)]),
    account_type: new FormControl(),
    account_subtype_private: new FormControl(),
    account_subtype_company: new FormControl(),
    active_account: new FormControl(),
    tier: new FormControl(),
    image: new FormControl()
  })

  

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
    console.log(this.accountCopy.subtype)
    if (type === 'COMPANY') {
      this.accountCopy.subtype = this.ACCOUNT_SUB_TYPES_COMPANY[0];
    } else if (type === 'PRIVATE') {
      this.accountCopy.subtype = this.ACCOUNT_SUB_TYPES_PRIVATE[0];
    }
  }

  public update() {
    if(this.loading || this.formGroup.invalid || !this.formGroup.dirty){
      return;
    }
    const changedProps: any = this.utils.deepDiff(this.accountCopy, this.account);
    delete changedProps.activity_main;
    if(changedProps.neighbourhood){
      delete changedProps.neighbourhood;
    }
    delete changedProps.kyc_manager;
    delete changedProps.schedule;
    delete changedProps.level;
    delete changedProps.pos;
    this.accountChanged.emit(changedProps);
    console.log(this.accountCopy)
  }
}
