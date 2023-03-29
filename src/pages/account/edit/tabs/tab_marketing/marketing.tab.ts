import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { AdminService } from 'src/services/admin/admin.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

const URL_REGEXP =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

@Component({
  selector: 'tab-marketing',
  templateUrl: './marketing.html',
})
export class MarketingTab {
  static readonly tabName = 'marketing';
  static readonly fields = ['public_image', 'description', 'offered_products'];

  @Input() public account: Account;
  @Input() public loading: boolean = false;
  @Output() public accountChanged: EventEmitter<Partial<Account>> = new EventEmitter();

  public accountCopy: any = {};
  public error: string;
  public pageName = 'MARKETING';

  public formGroup = new FormGroup({
    web: new FormControl('', Validators.pattern(URL_REGEXP)),
  });

  constructor(private utils: UtilsService, public alerts: AlertsService, public as: AdminService) {}

  public ngOnInit() {
    this.accountCopy = { ...this.account };
    this.formGroup.get('web').setValue(this.account.web);
  }

  public update() {
    if (this.formGroup.valid) {
      this.accountCopy.web = this.formGroup.get('web').value;
      const changedProps: any = this.utils.deepDiff(this.accountCopy, this.account);
      delete changedProps.activity_main;
      delete changedProps.kyc_manager;
      delete changedProps.schedule;
      delete changedProps.level;
      this.accountChanged.emit(changedProps);
    }
  }
}
