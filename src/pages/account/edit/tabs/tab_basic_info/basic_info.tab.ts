import { UtilsService } from 'src/services/utils/utils.service';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { Tier } from 'src/shared/entities/tier.ent';
import { TiersCrud } from 'src/services/crud/tiers/tiers.crud';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { AlertsService } from '../../../../../services/alerts/alerts.service';

@Component({
  selector: 'tab-basic-info',
  templateUrl: './basic_info.html',
})
export class BasicInfoTab implements OnInit {
  static readonly tabName = 'info';
  static readonly fields = ['prefix', 'phone', 'name',
    'email','cif','account_type','account_subtype',
    'active_account','tier','image'];

  @Input() public id = '';
  @Input() public account: Account;
  @Input() public loading: boolean = false;
  @Input() public isEdited: boolean;
  @Input() public shouldValidate: boolean = false;
  @Output() public accountChanged: EventEmitter<Partial<Account>> = new EventEmitter();

  public accountCopy: any = {};
  public initialValue: any = {};
  public edited: boolean = false;
  public subtypeCompanyAccount: any = '';
  public subtypePrivateAccount: any = '';
  public tiers: Tier[] = [];
  public error: string;
  public pageName = 'BASIC_INFO';
  public formGroup = new FormGroup({
    prefix: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    phone: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    name: new FormControl(''),
    email: new FormControl('', Validators.email),
    cif: new FormControl('', [
      Validators.maxLength(9),
      Validators.pattern(/([a-z]|[A-Z]|[0-9])[0-9]{7}([a-z]|[A-Z]|[0-9])/),
    ]),
    account_type: new FormControl(''),
    account_subtype_private: new FormControl(''),
    account_subtype_company: new FormControl(''),
    active_account: new FormControl(true),
    tier: new FormControl(null),
    image: new FormControl(null),
  });

  public ACCOUNT_TYPES = Account.ACCOUNT_TYPES;
  public ACCOUNT_SUB_TYPES_COMPANY = Account.ACCOUNT_SUB_TYPES_COMPANY;
  public ACCOUNT_SUB_TYPES_PRIVATE = Account.ACCOUNT_SUB_TYPES_PRIVATE;

  constructor(private tiersCrud: TiersCrud, private utils: UtilsService, private alerts: AlertsService) {}

  public ngOnInit() {
    this.accountCopy = { ...this.account };
    this.getTiers();
    this.formGroup.get('prefix').setValue(this.account.prefix);
    this.formGroup.get('phone').setValue(this.account.phone);
    this.formGroup.get('name').setValue(this.account.name);
    this.formGroup.get('email').setValue(this.account.email);
    this.formGroup.get('cif').setValue(this.account.cif);
    this.formGroup.get('account_type').setValue(this.account.type);
    this.setSubtypes();
    this.formGroup.get('active_account').setValue(this.account.active);
    this.formGroup.get('tier').setValue(this.account.level_id);
    this.formGroup.get('image').setValue(this.account.company_image);

    this.validation();
  }

  public ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['isEdited']) {
      this.edited = this.isEdited;
    }

    if (changes['shouldValidate'] && changes['shouldValidate'].currentValue) {
      this.shouldValidate = changes['shouldValidate'].currentValue;
      this.formGroup.markAllAsTouched();
    }
  }

  public setInitialValue() {
    this.initialValue = {
      prefix: this.accountCopy.prefix,
      phone: this.accountCopy.phone,
      name: this.accountCopy.name,
      email: this.accountCopy.email,
      cif: this.accountCopy.cif,
      account_type: this.accountCopy.type,
      account_subtype_company: this.accountCopy.type == 'COMPANY' ? this.accountCopy.subtype : '',
      account_subtype_private: this.accountCopy.type == 'PRIVATE' ? this.accountCopy.subtype : '',
      active_account: this.accountCopy.active,
      tier: this.accountCopy.level_id,
      image: this.accountCopy.company_image,
    };
  }

  public validation() {
    this.setInitialValue();
    this.formGroup.valueChanges.pipe(debounceTime(100)).subscribe((resp) => {
      this.edited = Object.keys(this.initialValue).some((key) => this.formGroup.value[key] != this.initialValue[key]);
    });
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
      this.formGroup.get('account_subtype_company').setValue(this.ACCOUNT_SUB_TYPES_COMPANY[0]);
      this.formGroup.get('account_subtype_private').setValue('');
    } else if (type === 'PRIVATE') {
      this.accountCopy.subtype = this.ACCOUNT_SUB_TYPES_PRIVATE[0];
      this.formGroup.get('account_subtype_company').setValue('');
      this.formGroup.get('account_subtype_private').setValue(this.ACCOUNT_SUB_TYPES_COMPANY[0]);
    }
  }

  public setSubtypes(){
    if (this.account.type == 'COMPANY') {
      this.formGroup.get('account_subtype_company').setValue(this.account.subtype);
    } else {
      this.formGroup.get('account_subtype_private').setValue(this.account.subtype);
    }
  }

  public update() {
    if (!this.formGroup.dirty || !this.edited || this.formGroup.invalid) {
      if (this.formGroup.invalid) {
        this.formGroup.markAllAsTouched();
        this.alerts.showSnackbar('INVALID_FIELDS', 'OK');
        return;
      }
      return;
    }

    

    //añadir los valores del formGroup al accountCopy
    this.accountCopy.prefix = this.formGroup.get('prefix').value;
    this.accountCopy.phone = this.formGroup.get('phone').value;
    this.accountCopy.name = this.formGroup.get('name').value;
    this.accountCopy.cif = this.formGroup.get('cif').value;
    this.accountCopy.email = this.formGroup.get('email').value;
    this.accountCopy.type = this.formGroup.get('account_type').value;

    if (this.formGroup.get('account_type').value == 'COMPANY') {
      this.accountCopy.subtype = this.formGroup.get('account_subtype_company').value;
    } else {
      this.accountCopy.subtype = this.formGroup.get('account_subtype_private').value;
    }

    this.accountCopy.active = this.formGroup.get('active_account').value;
    this.accountCopy.level_id = this.formGroup.get('tier').value;
    this.accountCopy.company_image = this.formGroup.get('image').value;

    //comparar los valores
    const changedProps: any = this.utils.deepDiff(this.accountCopy, this.account);

    delete changedProps.activity_main;
    if (changedProps.neighbourhood) {
      delete changedProps.neighbourhood;
    }
    delete changedProps.kyc_manager;
    delete changedProps.schedule;
    delete changedProps.level;
    delete changedProps.pos;
    delete changedProps._isCompany;
    this.accountChanged.emit(changedProps);
    this.edited = this.isEdited;
    this.setInitialValue();
  }
}
