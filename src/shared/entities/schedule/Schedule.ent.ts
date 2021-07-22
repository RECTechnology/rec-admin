import { ScheduleDay } from './ScheduleDay.ent';
import { ScheduleType } from './ScheduleType';

export enum ScheduleState {
  open,
  openAllDay,
  closed,
  notAvailable,
}

export interface ISchedule {
  type: ScheduleType;
  days: ScheduleDay[];
}

export class Schedule {
  /// Specifies the type of schedule
  type: ScheduleType;

  /// Specifies the schedule for each day of the week
  days: ScheduleDay[];

  get isClosed() {
    return this.type == ScheduleType.CLOSED;
  }

  get isTimetable() {
    return this.type == ScheduleType.TIMETABLE;
  }

  get opens24Hours() {
    return this.type == ScheduleType.FULL;
  }

  get isNotAvailable() {
    return this.type == ScheduleType.NOT_AVAILABLE;
  }

  constructor({ type, days }: ISchedule) {
    this.type = type ?? ScheduleType.NOT_AVAILABLE;

    if (!days || days.length <= 0) {
      this.days = Array(7)
        .fill(null)
        .map((el) => ScheduleDay.empty());
    } else {
      this.days = days;
    }
  }

  static getWeekdayName(weekday: number): string {
    if (weekday == 1) return 'MONDAY';
    if (weekday == 2) return 'TUESDAY';
    if (weekday == 3) return 'WEDNESDAY';
    if (weekday == 4) return 'THURSDAY';
    if (weekday == 5) return 'FRIDAY';
    if (weekday == 6) return 'SATURDAY';
    if (weekday == 7) return 'SUNDAY';
    return null;
  }

  static fromJsonString(jsonString) {
    let parsedJson = this._tryParseScheduleJsonString(jsonString);
    return Schedule.fromJson(parsedJson);
  }

  static fromJson(json) {
    let days = [];

    if (json['days'] != null) {
      let jsondays = json['days'];
      days = jsondays.length ? jsondays.map((el) => ScheduleDay.fromJson(el)) : [];
    }

    return new Schedule({
      type: ScheduleType.fromName(json['type']),
      days: days,
    });
  }

  toJson(): any {
    return {
      type: this.type.type,
      days: this.days.map((e) => e.toJson()),
    };
  }

  static _tryParseScheduleJsonString(jsonString: string) {
    try {
      var parsedJson = JSON.parse(jsonString);
      return parsedJson;
    } catch (e) {
      return {};
    }
  }
}
