import { AlertsService } from 'src/services/alerts/alerts.service';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { UtilsService } from 'src/services/utils/utils.service';
import { AdminService } from 'src/services/admin/admin.service';

@Component({
  selector: 'tab-location',
  templateUrl: './location.html',
})
export class LocationTab {
  @Input() public account: Account;
  @Input() public loading: boolean = false;
  @Output() public accountChanged: EventEmitter<Partial<Account>> = new EventEmitter();

  public accountCopy: any = {};
  public error: string;
  public pageName = 'LOCATION';

  constructor(private utils: UtilsService, public alerts: AlertsService, public as: AdminService) {}

  public ngOnInit() {
    this.accountCopy = { ...this.account };
  }

  public changeMapVisibility(id, visible, i) {
    this.loading = true;
    this.as.setMapVisibility(id, visible.checked).subscribe((resp) => {
      this.alerts.showSnackbar(
        visible.checked ? 'Organization is shown in map' : 'Organization is hidden from map',
        'ok',
      );
      this.loading = false;
    }, this.alerts.observableErrorSnackbar);
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
