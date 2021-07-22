import { ScheduleDay } from './../../shared/entities/schedule/ScheduleDay.ent';
import { Component, Input } from '@angular/core';
import { Schedule } from 'src/shared/entities/schedule/Schedule.ent';

@Component({
  selector: 'schedule-day-row',
  templateUrl: './schedule-day-row.component.html',
  styleUrls: ['./schedule-day-row.component.scss'],
})
export class ScheduleDayRowComponent {
  @Input() day: ScheduleDay;
  @Input() weekday: number = 1;
  @Input() closed: boolean = false;
  @Input() opens24Hours: boolean = false;
  @Input() isNotAvailable: boolean = false;

  public getWeekdayName(weekday) {
    return Schedule.getWeekdayName(weekday + 1);
  }

  public checkedChanged(checked) {
    console.log('changed', checked);
  }
}
