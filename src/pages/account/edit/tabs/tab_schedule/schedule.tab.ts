import { Schedule } from './../../../../../shared/entities/schedule/Schedule.ent';
import { ScheduleType } from './../../../../../shared/entities/schedule/ScheduleType';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from 'src/shared/entities/account.ent';
import { AccountsCrud } from 'src/services/crud/accounts/accounts.crud';
import { MySnackBarSevice } from 'src/bases/snackbar-base';


@Component({
  selector: 'tab-schedule',
  templateUrl: './schedule.html',
})
export class ScheduleTab {
  static readonly tabName = 'schedule';

  @Input() public account: Account;
  @Output() public close: EventEmitter<any> = new EventEmitter();
  @Input() public loading: boolean = false;
  @Output() public accountChanged: EventEmitter<any> = new EventEmitter();

  public error;
  public accountCopy: any = {};
  public schedule: Schedule;
  public pageName = 'SCHEDULES';
  public SCHEDULE_TYPES = ScheduleType.values.map((el) => el.type);

  constructor(
    public accountsCrud: AccountsCrud,
    public snackbar: MySnackBarSevice,
  ) { }

  public ngOnInit() {
    this.schedule = this.account.schedule as Schedule;
  }

  public scheduleTypeChanged(newType) {
    this.schedule.type = ScheduleType.fromName(newType);
  }

  public getWeekdayName(weekday) {
    return Schedule.getWeekdayName(weekday + 1);
  }
  public update() {
    const oldString = this.account.scheduleString;
    const newString = JSON.stringify(this.schedule.toJson());

    if (oldString != newString) {
      this.accountChanged.emit({
        schedule: newString,
      });
      return;
    }

    this.accountChanged.emit({});
  }
}
