export type ScheduleTypes = 'full' | 'timetable' | 'closed' | 'not_available';

export class ScheduleType {
  /** [FULL] means the schedule is opened 24 h */
  static FULL: ScheduleType = new ScheduleType('full');

  /** [TIMETABLE] means the schedule has set a schedule for each weekday */
  static TIMETABLE: ScheduleType = new ScheduleType('timetable');

  /** [CLOSED] means the schedule is closed */
  static CLOSED: ScheduleType = new ScheduleType('closed');

  /** [NOT_AVAILABLE] means the schedule is not available */
  static NOT_AVAILABLE: ScheduleType = new ScheduleType('not_available');

  /** List of all available ScheduleTypes */
  static values = [ScheduleType.FULL, ScheduleType.TIMETABLE, ScheduleType.CLOSED, ScheduleType.NOT_AVAILABLE];

  /** Lookup table */
  static map: { [key: string]: ScheduleType } = {
    full: ScheduleType.FULL,
    timetable: ScheduleType.TIMETABLE,
    closed: ScheduleType.CLOSED,
    not_available: ScheduleType.NOT_AVAILABLE,
  };

  /** Returns the schedule type for a name if found, otherwise null */
  static fromName = (name: ScheduleTypes): ScheduleType => ScheduleType.map[name];

  type: string;

  toString = () => this.type;

  constructor(type) {
    this.type = type;
  }
}
