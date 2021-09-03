import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { MySnackBarSevice } from 'src/bases/snackbar-base';
import { AdminService } from 'src/services/admin/admin.service';
import { AlertsService } from 'src/services/alerts/alerts.service';
import { UtilsService } from 'src/services/utils/utils.service';

@Component({
  selector: 'tab-marketing',
  templateUrl: './marketing.html',
})
export class MarketingTab {
  @Input() public account: Account;
  @Input() public loading: boolean = false;
  @Output() public accountChanged: EventEmitter<Partial<Account>> = new EventEmitter();

  public accountCopy: any = {};
  public error: string;
  public pageName = 'MARKETING';

  constructor(private utils: UtilsService, public alerts: AlertsService, public as: AdminService) {}


  public ngOnInit() {
    this.accountCopy = { ...this.account };
  }

  public update() {
    const changedProps: any = this.utils.deepDiff(this.accountCopy, this.account);
    delete changedProps.activity_main;
    delete changedProps.kyc_manager;
    delete changedProps.schedule;
    delete changedProps.level;
    this.accountChanged.emit(changedProps);
  }
}
