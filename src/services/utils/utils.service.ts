import { Injectable } from '@angular/core';
import { LoginService } from '../auth.service';
import * as deepmerge from 'deepmerge';

declare let _;

@Injectable()
export class UtilsService {
  public isSandbox = false;
  // tslint:disable-next-line
  public _idleSecondsCounter = 0;
  public IDLE_TIMEOUT = 600; //  Seconds
  public IDLE_TIMEOUT_MESSAGE = 60; //  Seconds
  public expires_in: any = 0;
  public minutes: any = 0;
  public seconds: any = 0;
  public userLang: string = 'en';
  public assistantURL = '/assistant';
  public showCounter = false;
  private isMDevice = false;

  constructor(private ls: LoginService) {

  }

  public openIdleModal = () => { return; };
  public closeIdleModal = () => { return; };

  public get isMobileDevice() {
    return this.isMobile();
  }

  public set isMobileDevice(val) {
    this.isMDevice = val;
  }

  public parseDateToParts(date: Date) {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getMinutes()).padStart(2, '0');

    const dateStr = `${year}-${month}-${day}`;
    const timeStr = `${hours}:${minutes}`;

    return {
      dateStr,
      day,
      hours,
      minutes,
      month,
      seconds,
      timeStr,
      year,
    };
  }

  public hasDatePassed(date: Date): boolean {
    return (new Date(date).getTime() - new Date().getTime()) <= 0;
  }

  public parseSchedule(scheduleString) {
    if (!scheduleString) {
      scheduleString = 'C,C,C/C,C,C/C,C,C/C,C,C/C,C,C/C,C,C/C,C,C';
    }

    const daysMap = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    let days = scheduleString.split('/')
      .map((ds) => ds.split(','));

    days = days.map((day, i) => {
      const mclosed = day[1] === 'C';
      const eclosed = day[2] === 'C';
      const closed = mclosed && eclosed;

      const morning = {
        close: '',
        closed: mclosed,
        open: '',
      };

      const evening = {
        close: '',
        closed: eclosed,
        open: '',
      };

      if (!mclosed) {
        const [open, close] = day[1] ? day[1].split(' - ') : ['08:00', '14:00'];
        morning.open = open;
        morning.close = close;
      }

      if (!eclosed) {
        const [open, close] = day[2] ? day[2].split(' - ') : ['08:00', '14:00'];
        evening.open = open;
        evening.close = close;
      }
      return {
        evening,
        morning,
        name: daysMap[i],
        open: !closed,
      };
    });

    return days;
  }

  public constructScheduleString(days) {
    const schedule = [];

    for (const day of days) {
      const closed = !day.open;
      const mclosed = day.morning.closed;
      const eclosed = day.evening.closed;

      const dayArray = [];

      if (closed) {
        dayArray.push('C');
      }

      if (mclosed) {
        dayArray.push('C');
      } else {
        dayArray.push(day.morning.open + ' - ' + day.morning.close);
      }

      if (eclosed) {
        dayArray.push('C');
      } else {
        dayArray.push(day.evening.open + ' - ' + day.evening.close);
      }

      schedule.push(dayArray.join(','));
    }

    return schedule.join('/');
  }

  /**
   * @param {Object} original - The original object to compare
   * @param {Object} compare  - The object with changed properties
   * @return {Object} - Will return a new object containing the changed properties
   */
  public deepDiff(original: any, compare: any): any {
    const r = {};
    _.each(original, (v, k) => {
      if (_.isArray(v || k)) { return; }
      if (compare[k] === v) { return; }
      r[k] = _.isObject(v) ? _.difference(v, compare[k]) : v;
    });
    return r;
  }

  /**
   * Checks if navigator is mobile device
   * @return {boolean} - is mobile or not
   */
  public isMobile(): boolean {
    const regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regexp.test(navigator.userAgent);
  }

  /**
   * Checks if '_idleSecondsCounter' is bigger than 'IDLE_TIMEOUT'
   */
  public checkIdleTime(): void {
    const date_now = Date.now() + '';
    const status = localStorage.getItem('session_status');
    const login_date = localStorage.getItem('login_date');
    const sinceLogin = (+date_now - +login_date) / 1000;
    this.showCounter = localStorage.getItem('show-counter') === 'show';

    if (sinceLogin > 600) {
      this.closeIdleModal();
      this.ls.logout();
      return;
    }

    if (status === 'active' || status === 'stand_by') {
      this._idleSecondsCounter += 1;
      this.expires_in = this.IDLE_TIMEOUT - this._idleSecondsCounter;
      this.minutes = Math.floor(this.expires_in / 60);
      this.seconds = this.expires_in - (this.minutes * 60);

      if (this._idleSecondsCounter >= this.IDLE_TIMEOUT) {
        localStorage.setItem('session_status', 'expired');
        this.closeIdleModal();
        this.ls.logout();
        return;
      } else if (this._idleSecondsCounter >= (this.IDLE_TIMEOUT - 59)) {
        if (status === 'active') {
          localStorage.setItem('session_status', 'stand_by');
          this.openIdleModal();
        }
      } else {
        localStorage.setItem('last_session_date', date_now);
      }
    }
  }

  public constructAddressString(group_data) {
    const address = [
      group_data.street,
      group_data.address_number,
      group_data.country,
      group_data.city,
      group_data.zip,
    ].filter((a) => !!a);

    return address.join(', ');
  }

  public mergeObjects(a, b) {
    return deepmerge(a, b);
  }
}
