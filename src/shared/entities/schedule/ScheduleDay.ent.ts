export interface IScheduleDay {
  firstOpen: string;
  firstClose: string;
  secondOpen: string;
  secondClose: string;
  opens?: boolean;
}

/**
 * 
 * Adds a cero before a time, so it can be used in `<input type="time">`
 * Example:
 * ```js
 * paddTimeToFitFormat('8:30'); // 08:30
 * paddTimeToFitFormat('10:30'); // 10:30
 * paddTimeToFitFormat('08:30'); // 08:30
 * ```
 */
function paddTimeToFitFormat(time) {
  return (/\d\d:\d\d/.test(time) ? '' : '0') + time;
}
export class ScheduleDay {
  static defaultSchedule: ScheduleDay = new ScheduleDay({
    firstOpen: '09:00',
    firstClose: '14:00',
    secondOpen: '17:00',
    secondClose: '20:00',
  });

  firstOpen: string;
  firstClose: string;
  secondOpen: string;
  secondClose: string;
  opens: boolean;

  constructor({ firstOpen, firstClose, secondOpen, secondClose, opens = false }: IScheduleDay) {
    this.firstOpen = firstOpen ? paddTimeToFitFormat(firstOpen): firstOpen;
    this.firstClose = firstClose ? paddTimeToFitFormat(firstClose): firstClose;
    this.secondOpen = secondOpen ? paddTimeToFitFormat(secondOpen): secondOpen;
    this.secondClose = secondClose ? paddTimeToFitFormat(secondClose): secondClose;
    this.opens = opens;
  }

  /** Sets times to predefined one [ScheduleDay.defaultSchedule] */
  resetToDefaultTime() {
    this.copyFrom(ScheduleDay.defaultSchedule);
  }

  /**  Copies the data from another [ScheduleDay] into this */
  copyFrom(otherDay: ScheduleDay) {
    this.firstOpen = otherDay.firstOpen;
    this.firstClose = otherDay.firstClose;
    this.secondOpen = otherDay.secondOpen;
    this.secondClose = otherDay.secondClose;
    this.opens = otherDay.opens;
  }

  toJson(): any {
    return {
      first_open: this.firstOpen,
      first_close: this.firstClose,
      second_open: this.secondOpen,
      second_close: this.secondClose,
      opens: this.opens,
    };
  }

  static empty() {
    return new ScheduleDay({
      firstOpen: '',
      firstClose: '',
      secondOpen: '',
      secondClose: '',
      opens: false,
    });
  }

  static fromJson(data: any) {
    const firstOpen = data['first_open'];
    const firstClose = data['first_close'];
    const secondOpen = data['second_open'];
    const secondClose = data['second_close'];

    /// For old schedule data
    if (!('opens' in data)) {
      const hasFirst = firstOpen && firstClose;
      const hasSecond = secondOpen && secondClose;

      data['opens'] = hasFirst || hasSecond;
    }

    return new ScheduleDay({
      firstOpen: firstOpen,
      firstClose: firstClose,
      secondOpen: secondOpen,
      secondClose: secondClose,
      opens: data['opens'] ?? false,
    });
  }

  // factory ScheduleDay.fromJson(Map<String, dynamic> json) {
  //   var firstOpen = json['first_open'];
  //   var firstClose = json['first_close'];
  //   var secondOpen = json['second_open'];
  //   var secondClose = json['second_close'];

  //   /// For old schedule data
  //   if (!json.containsKey('opens')) {
  //     var hasFirst =
  //         Checks.isNotEmpty(firstOpen) && Checks.isNotEmpty(firstClose);
  //     var hasSecond =
  //         Checks.isNotEmpty(secondOpen) && Checks.isNotEmpty(secondClose);

  //     json['opens'] = hasFirst || hasSecond;
  //   }

  //   return ScheduleDay(
  //     firstOpen: firstOpen,
  //     firstClose: firstClose,
  //     secondOpen: secondOpen,
  //     secondClose: secondClose,
  //     opens: json['opens'] ?? false,
  //   );
  // }
}
